<template>
    <div id="for">
        <ol>
            <li v-for="todo intodos">
                {{todo.text}}
            </li>
        </ol>
    </div>
    <div id="app-2">
        <span v-bind:title="message">鼠标悬停几秒查看此处动态绑定的信息</span>
    </div>
</template>

<script>
    export default {
        name: "a"
    }
    new Vue({
        el:'#for',
        data:[
            {text:'学习Java开发'},
            {text:'学习Vue'},
            {text:'做项目'}
        ]
    })
    var app2=new Vue({
        el:'#app-2',
        data:{
            message:'页面加载于'+new Date().toLocaleString()
        }
    })
</script>

<style scoped>

</style>