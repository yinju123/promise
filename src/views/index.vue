<template>
  <div class="container">
    <!-- <div class="center">
      <div class="center_inner">center_inner</div>
    </div> -->
    <div class="left">left</div>
    <div class="center">center</div>
    <div class="right">right</div>
  </div>
</template>

<script>
import Promise from "@/utils/promise";
export default {
  props: {},
  data() {
    return {};
  },
  watch: {},
  computed: {},
  created() {
    let p2 = new Promise((resolve, reject) => {
      reject(2);
      resolve(33);
    })

    let p3 = p2.then()

    console.log('p2', p2)
  },
  mounted() {},
  methods: {},
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

