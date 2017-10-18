<template>
	<div class="middle-box text-center animated fadeInDown">
        <h1>404</h1>
        <h3 class="font-bold">页面未找到！</h3>
        <div class="error-desc">
            抱歉，页面好像去火星了~            
        </div>
    </div>
</template>
<script>
export default {
	mounted(){			
		$("body").addClass("gray-bg");
	},
	destroyed(){
		$("body").removeClass("gray-bg");
	}
}
</script>

<style scoped>
    .page-container {
        font-size: 20px;
        text-align: center;
        color: rgb(192, 204, 218);
    }
</style>