import {validate} from "../validation/validation.js";
import {
    getUserValidation,
    loginUserValidation,
    registerUserValidation,
    updateUserValidation
} from "../validation/user-validation.js";
import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";
import { withSpan } from "../application/tracer.js";

const register = async (request) => {
    return withSpan("service.register", async () => {
        const user = await withSpan("validation.register", async () => {
            return validate(registerUserValidation, request);
        }, { "validation.type": "register" });

        const countUser = await withSpan("db.user.count", async () => {
            return prismaClient.user.count({
                where: { username: user.username }
            });
        }, { "db.operation": "count", "db.table": "user" });

        if (countUser === 1) {
            throw new ResponseError(400, "Username already exists");
        }

        user.password = await withSpan("bcrypt.hash", async () => {
            return bcrypt.hash(user.password, 10);
        }, { "bcrypt.rounds": 10 });

        return await withSpan("db.user.create", async () => {
            return prismaClient.user.create({
                data: user,
                select: { username: true, name: true }
            });
        }, { "db.operation": "create", "db.table": "user" });
    }, { "service.operation": "register" });
}

const login = async (request) => {
    return withSpan("service.login", async () => {
        const loginRequest = await withSpan("validation.login", async () => {
            return validate(loginUserValidation, request);
        }, { "validation.type": "login" });

        const user = await withSpan("db.user.findUnique", async () => {
            return prismaClient.user.findUnique({
                where: { username: loginRequest.username },
                select: { username: true, password: true }
            });
        }, { "db.operation": "findUnique", "db.table": "user" });

        if (!user) {
            throw new ResponseError(401, "Username or password wrong");
        }

        const isPasswordValid = await withSpan("bcrypt.compare", async () => {
            return bcrypt.compare(loginRequest.password, user.password);
        }, { "bcrypt.operation": "compare" });

        if (!isPasswordValid) {
            throw new ResponseError(401, "Username or password wrong");
        }

        const token = uuid().toString();

        return await withSpan("db.user.update", async () => {
            return prismaClient.user.update({
                data: { token: token },
                where: { username: user.username },
                select: { token: true }
            });
        }, { "db.operation": "update", "db.table": "user" });
    }, { "service.operation": "login" });
}

const get = async (username) => {
    username = validate(getUserValidation, username);

    const user = await prismaClient.user.findUnique({
        where: { username: username },
        select: { username: true, name: true }
    });

    if (!user) {
        throw new ResponseError(404, "user is not found");
    }

    return user;
}

const update = async (request) => {
    const user = validate(updateUserValidation, request);

    const totalUserInDatabase = await prismaClient.user.count({
        where: { username: user.username }
    });

    if (totalUserInDatabase !== 1) {
        throw new ResponseError(404, "user is not found");
    }

    const data = {};
    if (user.name) {
        data.name = user.name;
    }
    if (user.password) {
        data.password = await bcrypt.hash(user.password, 10);
    }

    return prismaClient.user.update({
        where: { username: user.username },
        data: data,
        select: { username: true, name: true }
    })
}

const logout = async (username) => {
    username = validate(getUserValidation, username);

    const user = await prismaClient.user.findUnique({
        where: { username: username }
    });

    if (!user) {
        throw new ResponseError(404, "user is not found");
    }

    return prismaClient.user.update({
        where: { username: username },
        data: { token: null },
        select: { username: true }
    })
}

export default {
    register,
    login,
    get,
    update,
    logout
}
