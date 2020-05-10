<template>
  <!-- 流程实例监控 -->
  <div style="height: 100vh">
    <iframe
      src="workflow/index.html#/workflow/monitor/processInstanceMonitor"
      frameborder="0"
      width="100%"
      height="100%"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component({})
export default class extends Vue {
  
}
</script>
