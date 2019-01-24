<template>
  <!-- <div class="column">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title has-text-grey">
          {{ title }}
        </p>
      </header>
      <div class="card-content">
        <div class="content has-text-centered">
          <img
            :src=imageSrc
          />
        </div>
      </div>
      <footer class="card-footer">
        <div class="card-footer-item">
          <span>
            <slot />
          </span>
        </div>
      </footer>
    </div>
  </div> -->
  <div class="card" >
  <div class="card-content">
    <div class="media">
      <div class="media-left">
        <figure class="image is-64x64">
          <img :src=imageSrc alt="">
        </figure>
      </div>
      <div class="media-content center">
        <p class="title is-4">{{ title }}</p>
      </div>
    </div>

    <div class="content">
      <div class="columns">
        <div class="column is-half is-mobile ">
          <div class="columns is-multiline">
            <div class="column is-full value">
              12
            </div>
            <div class="column is-full label">
              Followers
            </div>
          </div>
        </div>
        <div class="column is-half ">
          <div class="columns is-multiline">
            <div class="column is-full value">
              5
            </div>
            <div class="column is-full label">
              Datasets
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    imageSrc: {
      type: String,
      required: true
    },
    description:{
      type:String,
      required:true
    }
  }
}
</script>
<style scoped>
img{
  height:50px;
}
.card{
  padding:0px;
  margin:5px;
}
.value{
  text-align: center;
  font-size: 2em;
  color: darkslateblue;
  padding-bottom:0px;
}
.label{
  text-align: center;
  font-size: 1em;
  color:black;
}
</style>