<template>
  <div id="app">
    <div class="container wrap">
      <!-- <b-navbar :fixed-top="true">
        <template slot="brand">
          <b-navbar-item> -->
            <h1 class="app-title">Code Memo</h1>
          <!-- </b-navbar-item>
        </template>
        
      </b-navbar> -->
      <router-view/>
    </div>
  </div>
</template>

<style> 
html,
body,
#app {
  height: 100%; /* min-heightに対応していないブラウザ用 */
}
 
body > #app {
  height: auto; /* 要素を超えた分の背景が伸びないブラウザ用 */
}
#app {
  padding: 30px 0;
  min-height: 100%; /* 最小の高さ */
  background-color: #393e46;
}

.wrap {
  margin: 0 auto !important;
  width: 70% !important;
}

.app-title {
  color: #f5f2f0;
  font-size: 2rem;
  border-bottom: 1px solid #f5f2f0;
}
</style>
