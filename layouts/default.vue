<template>
<div class="body">
    <nav
      class="navbar header has-shadow is-spaced"
      role="navigation"
      aria-label="main navigation"
    >
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

        <div class="navbar-burger">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div class="navbar-end">
        <nuxt-link class="navbar-item" to="/">
          Datasets
        </nuxt-link>
        <nuxt-link class="navbar-item" to="/organisations">
          Organizations
        </nuxt-link>
        <nuxt-link class="navbar-item" to="/">
          Group
        </nuxt-link>
        <nuxt-link class="navbar-item" to="/about-us">
          About Us
        </nuxt-link>
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
      ]
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
}

.nuxt-link-exact-active{
  color:#0d47a1;
}
</style>