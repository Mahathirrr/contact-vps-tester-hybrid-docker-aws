<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const scrollY = ref(0);
const isVisible = ref({});
const mobileMenuOpen = ref(false);

function goToLogin() {
  router.push("/login");
}

function goToRegister() {
  router.push("/register");
}

function handleScroll() {
  scrollY.value = window.scrollY;
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
    mobileMenuOpen.value = false;
  }
}

function setupObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value[entry.target.dataset.animate] = true;
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  document.querySelectorAll("[data-animate]").forEach((el) => {
    if (!el.classList.contains('animate-fade-in-up')) {
      el.style.opacity = "0";
    }
    observer.observe(el);
  });

  return observer;
}

let observer;

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
  observer = setupObserver();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  if (observer) observer.disconnect();
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-blue-950 relative overflow-hidden">
    <!-- Animated Background Stars -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div
        v-for="i in 50"
        :key="i"
        class="star"
        :style="{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${2 + Math.random() * 4}s`,
        }"
      ></div>
    </div>

    <!-- Floating Orbs -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div
        class="absolute w-96 h-96 rounded-full bg-blue-600/10 blur-3xl"
        :style="{
          left: '10%',
          top: `${20 + scrollY * 0.02}%`,
          transition: 'top 0.3s ease-out',
        }"
      ></div>
      <div
        class="absolute w-80 h-80 rounded-full bg-purple-600/10 blur-3xl"
        :style="{
          right: '5%',
          top: `${50 - scrollY * 0.01}%`,
          transition: 'top 0.3s ease-out',
        }"
      ></div>
      <div
        class="absolute w-64 h-64 rounded-full bg-cyan-600/10 blur-3xl"
        :style="{
          left: '60%',
          top: `${70 + scrollY * 0.015}%`,
          transition: 'top 0.3s ease-out',
        }"
      ></div>
    </div>

    <!-- Navigation -->
    <nav class="fixed top-4 left-0 right-0 z-50 px-4">
      <div
        class="max-w-5xl mx-auto flex items-center justify-between px-6 py-3 rounded-full border transition-all duration-500"
        :class="scrollY > 20
          ? 'bg-gray-900/80 backdrop-blur-xl border-gray-700/50 shadow-2xl shadow-black/20'
          : 'bg-gray-900/40 backdrop-blur-md border-gray-700/30'"
      >
        <!-- Logo -->
        <div class="flex items-center gap-2.5 shrink-0">
          <div class="w-8 h-8 bg-gradient rounded-lg flex items-center justify-center shadow-lg">
            <i class="fas fa-address-book text-white text-sm"></i>
          </div>
          <span class="text-white font-bold text-lg tracking-tight hidden sm:block">Contact Management</span>
        </div>

        <!-- Desktop Links -->
        <div class="hidden md:flex items-center gap-1">
          <button @click="scrollToSection('features')" class="text-gray-300 hover:text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors">Features</button>
          <button @click="scrollToSection('how-it-works')" class="text-gray-300 hover:text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors">How It Works</button>
          <button @click="scrollToSection('pricing')" class="text-gray-300 hover:text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors">Pricing</button>
        </div>

        <!-- Auth Buttons -->
        <div class="flex items-center gap-3 shrink-0">
          <button
            @click="goToLogin"
            class="hidden sm:block text-gray-300 hover:text-white text-sm font-medium transition-colors"
          >
            Sign in
          </button>
          <button
            @click="goToRegister"
            class="group bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center gap-1.5"
          >
            Get started
            <i class="fas fa-chevron-right text-xs group-hover:translate-x-0.5 transition-transform"></i>
          </button>
          <!-- Mobile menu toggle -->
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-gray-300 hover:text-white p-1">
            <i class="fas fa-bars text-lg"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div
        v-if="mobileMenuOpen"
        class="md:hidden mt-2 max-w-5xl mx-auto bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 shadow-2xl"
      >
        <div class="flex flex-col gap-2">
          <button @click="scrollToSection('features')" class="text-gray-300 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors text-left">Features</button>
          <button @click="scrollToSection('how-it-works')" class="text-gray-300 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors text-left">How It Works</button>
          <button @click="scrollToSection('pricing')" class="text-gray-300 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors text-left">Pricing</button>
          <div class="border-t border-gray-700/50 my-1"></div>
          <button @click="goToLogin" class="text-gray-300 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors text-left">Sign in</button>
          <button @click="goToRegister" class="bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors text-left">Get started</button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative pt-36 pb-20 px-4">
      <div class="container mx-auto text-center max-w-5xl">
        <div
          class="inline-flex items-center px-4 py-2 bg-gray-800/60 backdrop-blur-sm rounded-full border border-gray-700/50 mb-8 animate-fade-in-up"
        >
          <span class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
          <span class="text-gray-300 text-sm">v1.0 is now live</span>
        </div>

        <h1
          class="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up"
          style="animation-delay: 0.1s"
        >
          Manage Your Contacts<br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Like a Pro
          </span>
        </h1>

        <p
          class="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up"
          style="animation-delay: 0.2s"
        >
          Organize, search, and manage all your contacts in one beautiful place.
          Built for professionals who value efficiency and elegance.
        </p>

        <div
          class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up"
          style="animation-delay: 0.3s"
        >
          <button
            @click="goToRegister"
            class="group bg-gradient text-white px-8 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition-all duration-300 shadow-xl hover:shadow-blue-500/40 hover:-translate-y-1 flex items-center"
          >
            <i class="fas fa-rocket mr-3 group-hover:animate-bounce"></i>
            Start for Free
          </button>
          <button
            @click="goToLogin"
            class="group bg-gray-800/60 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-semibold border border-gray-700/50 hover:bg-gray-700/60 transition-all duration-300 hover:-translate-y-1 flex items-center"
          >
            <i class="fas fa-sign-in-alt mr-3 group-hover:translate-x-1 transition-transform"></i>
            Sign In
          </button>
        </div>

        <!-- Stats -->
        <div
          class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-fade-in-up"
          style="animation-delay: 0.4s"
        >
          <div class="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 card-hover">
            <div class="text-3xl font-bold text-white mb-1">10K+</div>
            <div class="text-gray-400 text-sm">Users</div>
          </div>
          <div class="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 card-hover">
            <div class="text-3xl font-bold text-white mb-1">50K+</div>
            <div class="text-gray-400 text-sm">Contacts</div>
          </div>
          <div class="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 card-hover">
            <div class="text-3xl font-bold text-white mb-1">99.9%</div>
            <div class="text-gray-400 text-sm">Uptime</div>
          </div>
          <div class="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 card-hover">
            <div class="text-3xl font-bold text-white mb-1">4.9</div>
            <div class="text-gray-400 text-sm">Rating</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 px-4 relative">
      <div class="container mx-auto max-w-6xl">
        <div
          class="text-center mb-16"
          data-animate="features-title"
          :class="{ 'animate-fade-in-up': isVisible['features-title'] }"
        >
          <span class="text-blue-400 font-medium text-sm uppercase tracking-wider">Features</span>
          <h2 class="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">
            Everything You Need
          </h2>
          <p class="text-gray-400 text-lg max-w-2xl mx-auto">
            Powerful features designed to make contact management effortless
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(feature, index) in [
              {
                icon: 'fa-users',
                color: 'blue',
                title: 'Contact Management',
                desc: 'Create, edit, and organize all your contacts with an intuitive interface.',
              },
              {
                icon: 'fa-search',
                color: 'purple',
                title: 'Smart Search',
                desc: 'Find any contact instantly with powerful search by name, email, or phone.',
              },
              {
                icon: 'fa-map-marker-alt',
                color: 'cyan',
                title: 'Address Book',
                desc: 'Store multiple addresses for each contact with detailed information.',
              },
              {
                icon: 'fa-shield-alt',
                color: 'green',
                title: 'Secure & Private',
                desc: 'Your data is protected with secure authentication and encrypted storage.',
              },
              {
                icon: 'fa-mobile-alt',
                color: 'orange',
                title: 'Responsive Design',
                desc: 'Access your contacts from any device with a fully responsive interface.',
              },
              {
                icon: 'fa-bolt',
                color: 'yellow',
                title: 'Lightning Fast',
                desc: 'Built with modern technology for blazing fast performance.',
              },
            ]"
            :key="index"
            :data-animate="`feature-${index}`"
            class="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30 card-hover group"
            :class="{ 'animate-fade-in-up': isVisible[`feature-${index}`] }"
            :style="{ animationDelay: `${0.1 * index}s` }"
          >
            <div
              :class="`w-14 h-14 bg-${feature.color}-500/20 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`"
            >
              <i :class="`fas ${feature.icon} text-${feature.color}-400 text-2xl`"></i>
            </div>
            <h3 class="text-xl font-bold text-white mb-3">{{ feature.title }}</h3>
            <p class="text-gray-400 leading-relaxed">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section id="how-it-works" class="py-20 px-4 relative">
      <div class="container mx-auto max-w-5xl">
        <div
          class="text-center mb-16"
          data-animate="how-title"
          :class="{ 'animate-fade-in-up': isVisible['how-title'] }"
        >
          <span class="text-blue-400 font-medium text-sm uppercase tracking-wider">How It Works</span>
          <h2 class="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">
            Get Started in Minutes
          </h2>
          <p class="text-gray-400 text-lg max-w-2xl mx-auto">
            Three simple steps to organize your contacts
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="(step, index) in [
              {
                step: '01',
                icon: 'fa-user-plus',
                title: 'Create Account',
                desc: 'Sign up for free and set up your profile in seconds.',
              },
              {
                step: '02',
                icon: 'fa-address-card',
                title: 'Add Contacts',
                desc: 'Import or manually add your contacts with all their details.',
              },
              {
                step: '03',
                icon: 'fa-check-circle',
                title: 'Stay Organized',
                desc: 'Search, update, and manage your contacts effortlessly.',
              },
            ]"
            :key="index"
            :data-animate="`step-${index}`"
            class="relative"
            :class="{ 'animate-fade-in-up': isVisible[`step-${index}`] }"
            :style="{ animationDelay: `${0.15 * index}s` }"
          >
            <!-- Connector Line -->
            <div
              v-if="index < 2"
              class="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-500/50 to-purple-500/50"
            ></div>

            <div class="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30 text-center card-hover relative z-10">
              <div class="text-5xl font-black text-gray-700 mb-4">{{ step.step }}</div>
              <div class="w-16 h-16 bg-gradient rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                <i :class="`fas ${step.icon} text-white text-2xl`"></i>
              </div>
              <h3 class="text-xl font-bold text-white mb-3">{{ step.title }}</h3>
              <p class="text-gray-400">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section id="pricing" class="py-20 px-4 relative">
      <div
        class="container mx-auto max-w-4xl"
        data-animate="cta"
        :class="{ 'animate-fade-in-up': isVisible['cta'] }"
      >
        <div
          class="relative bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-3xl p-12 md:p-16 border border-blue-500/20 overflow-hidden"
        >
          <!-- Decorative elements -->
          <div class="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div class="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div class="relative z-10 text-center">
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p class="text-gray-300 text-lg mb-10 max-w-xl mx-auto">
              Join thousands of users who trust our platform for their contact management needs.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                @click="goToRegister"
                class="group bg-white text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-xl hover:-translate-y-1 flex items-center justify-center"
              >
                <i class="fas fa-user-plus mr-3"></i>
                Create Free Account
              </button>
              <button
                @click="goToLogin"
                class="group bg-gray-800/60 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-semibold border border-gray-600 hover:bg-gray-700/60 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center"
              >
                <i class="fas fa-sign-in-alt mr-3"></i>
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="relative px-4 pb-8 pt-4">
      <div class="container mx-auto max-w-5xl">
        <!-- Footer Card -->
        <div class="bg-gray-800/60 backdrop-blur-xl rounded-3xl border border-gray-700/40 p-8 md:p-12 relative overflow-hidden">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-10">
            <!-- Brand Column -->
            <div class="md:col-span-5">
              <div class="flex items-center gap-2.5 mb-4">
                <div class="w-8 h-8 bg-gradient rounded-lg flex items-center justify-center shadow-lg">
                  <i class="fas fa-address-book text-white text-sm"></i>
                </div>
                <span class="text-white font-bold text-lg">Contact Management</span>
              </div>
              <p class="text-gray-400 text-sm leading-relaxed max-w-xs mb-6">
                Empowering professionals to organize, search, and manage contacts with elegance and efficiency.
              </p>
              <div class="flex items-center gap-3">
                <a href="#" class="w-9 h-9 rounded-lg bg-gray-700/60 border border-gray-600/40 hover:bg-gray-600 hover:border-gray-500 flex items-center justify-center text-gray-300 hover:text-white transition-all">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="#" class="w-9 h-9 rounded-lg bg-gray-700/60 border border-gray-600/40 hover:bg-gray-600 hover:border-gray-500 flex items-center justify-center text-gray-300 hover:text-white transition-all">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="#" class="w-9 h-9 rounded-lg bg-gray-700/60 border border-gray-600/40 hover:bg-gray-600 hover:border-gray-500 flex items-center justify-center text-gray-300 hover:text-white transition-all">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="#" class="w-9 h-9 rounded-lg bg-gray-700/60 border border-gray-600/40 hover:bg-gray-600 hover:border-gray-500 flex items-center justify-center text-gray-300 hover:text-white transition-all">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                </a>
              </div>
            </div>

            <!-- Link Columns -->
            <div class="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h4 class="text-white font-semibold text-sm mb-4">Product</h4>
                <ul class="space-y-2.5">
                  <li><a href="#features" @click.prevent="scrollToSection('features')" class="text-gray-400 hover:text-white text-sm transition-colors">Features</a></li>
                  <li><a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Pricing</a></li>
                  <li><a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Integrations</a></li>
                  <li><a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Changelog</a></li>
                </ul>
              </div>
              <div>
                <h4 class="text-white font-semibold text-sm mb-4">Resources</h4>
                <ul class="space-y-2.5">
                  <li><a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Documentation</a></li>
                  <li><a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Tutorials</a></li>
                  <li><a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Blog</a></li>
                  <li><a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Support</a></li>
                </ul>
              </div>
              <div>
                <h4 class="text-white font-semibold text-sm mb-4">Company</h4>
                <ul class="space-y-2.5">
                  <li><a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">About</a></li>
                  <li><a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Careers</a></li>
                  <li><a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Contact</a></li>
                  <li><a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Partners</a></li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Bottom Bar -->
          <div class="mt-10 pt-6 border-t border-gray-700/40 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
            <p class="text-gray-500 text-xs">&copy; 2025 Contact Management. All rights reserved.</p>
            <div class="flex items-center gap-5">
              <a href="#" class="text-gray-500 hover:text-gray-300 text-xs transition-colors">Privacy Policy</a>
              <a href="#" class="text-gray-500 hover:text-gray-300 text-xs transition-colors">Terms of Service</a>
              <a href="#" class="text-gray-500 hover:text-gray-300 text-xs transition-colors">Cookies Settings</a>
            </div>
          </div>

          <!-- Large Watermark Text inside card -->
          <div class="absolute bottom-0 left-0 right-0 flex justify-center translate-y-1/2 select-none pointer-events-none">
            <span class="text-[6rem] md:text-[10rem] font-black text-white/[0.03] tracking-tighter whitespace-nowrap">
              Contact
            </span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Star Animation */
.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  opacity: 0;
  animation: twinkle linear infinite;
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 0.8;
    transform: scale(1);
  }
}

/* Fade In Up Animation */
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Card Hover */
.card-hover {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.4);
  border-color: rgba(59, 130, 246, 0.3);
}

/* Smooth Scroll */
html {
  scroll-behavior: smooth;
}
</style>
