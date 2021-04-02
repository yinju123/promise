<template>
  <div class="container">
    <!-- <div class="center">
      <div class="center_inner">center_inner</div>
    </div> -->
    <!-- <div class="left" >left</div>
    <div class="center" >center</div>
    <div class="right" >right</div> -->
  </div>
</template>

<script>
import Promise from "@/utils/promise";
const arr = []
export default {
  props: {},
  data() {
    return {};
  },
  watch: {},
  computed: {},
  created() {
    
    let p = new Promise((resolve ,reject) => {
      resolve(1)
    })

    p.then(res => {
      let obj = {
        then:(onFulfilled) => {
          setTimeout(() => {
            let y = {
              then: function (onFulfilled) {
                onFulfilled({a:1});
                throw {a:2};
              }
            }
            onFulfilled(y)
          })
        }
      }
      return obj
    }).then(res => {
      console.log('res2', res)
    })
  },
  mounted() {},
  methods: {
    
  },
  components: {},
};
</script>
<style lang="scss" scoped>
.container {
  display: grid;
  width: 570px;
  height: 300px;
  border: 1px solid red;
  grid-template-columns: 100px auto 100px;
}
.left,
.center,
.right {
  // width: 100px;
  // height: 100%;
  box-shadow: 0 0 10px 0;
  // flex: auto;
}

.left {
  // width: 200px;
}
.center {
  // flex: 1 1 100px;
}
.right {
  // width: 150px;
}
</style>

