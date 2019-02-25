<template>
<div class="body">
    <nav
      class="navbar header has-shadow is-spaced"
      role="navigation"
      aria-label="main navigation">
      <div class="navbar-brand">
        <a
          class="navbar-item"
          href="/"
        >
          <img
            src="~assets/dataportal-logo.png"
            alt="Buefy"
            height="28"
          >
        </a>

        <div class="navbar-burger" v-on:click="toggleMenu()">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div class="navbar-menu" v-bind:class="{ 'is-active': opened }">
        <div class="navbar-end">
          <nuxt-link class="navbar-item" to="/login">
            Login
          </nuxt-link>
          <nuxt-link class="navbar-item" to="/signup">
            Signup
          </nuxt-link>
          <nuxt-link class="navbar-item" to="/">
            Datasets
          </nuxt-link>
          <nuxt-link class="navbar-item" to="/organisations">
            Organizations
          </nuxt-link>
          <nuxt-link class="navbar-item" to="/groups">
            Groups
          </nuxt-link>
          <nuxt-link class="navbar-item" to="/about-us">
            About Us
          </nuxt-link>
        </div>
      </div>
    </nav>

    <section class="main-content">
        <nuxt />
    </section>
  <footer class="content footer is-dark">
    <p class="has-text-centered">
      <strong>About Factly</strong>
    </p>
    <p>
      <a href="http://www.factly.com">FACTLY</a> is one of the well known Data Journalism/Public Information portals in India. Each news story on FACTLY is backed by factual evidence/data from official sources that is either available in the public domain or that is collated/gathered/collected using tools such as the Right to Information (RTI).
    </p>
    <p>
      © 2018 Factly | Except for videos, content on this site is licensed under a Creative Commons Attribution 4.0 International License.
    </p>
  </footer>
</div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          title: 'Home',
          icon: 'home',
          to: { name: 'index' }
        },
        {
          title: 'Inspire',
          icon: 'lightbulb',
          to: { name: 'inspire' }
        }
      ],
      opened:false
    }
  },
  methods:{
    toggleMenu(){
      this.opened = !this.opened;
    }
  }
}
</script>
<style scoped>
/* .body{
  margin:80px;
} */
.main-content{
  min-height: 300px;
}
.body > * {
  padding:20px 70px 0px 70px;
}

.footer{
  padding-bottom: 2em;
  margin-top:5em;
}


.body{
  background:#f2f3f6;
  min-height: 100%;
}

.nuxt-link-exact-active{
  color:#0d47a1;
}
</style>