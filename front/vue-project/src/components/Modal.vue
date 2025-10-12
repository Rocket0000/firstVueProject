<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
    title: String,
    desc: String,
    btnType: {
        type: String,
        default: ""
    },
    isOpen:{
        type: Boolean,
    }
})
const emit = defineEmits(["confirm", "update:isOpen"]);

function isConfirm(){
    emit("confirm");
    isOpen.value = false;
}

function isCancel(){    
    emit("update:isOpen", false);
}
</script>

<template>
    <div class="modal_wrapper" :class="{show: isOpen}">
        <div class="modal">
            <h2>{{title}}</h2>
            <p v-if="desc">{{ desc }}</p>
            <div v-if="btnType === 'two'" class="btn_box">
                <button type="button" @click="isConfirm">확인</button>
                <button type="button" @click="isCancel">취소</button>
            </div>
            <div v-else class="btn_box">
                <button type="button" @click="isCancel">취소</button>
            </div>
        </div>
    </div>
</template>


<style>
    .modal_wrapper{
        display: none;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: rgba(0,0,0, .5);
    }
    .modal{
        padding: 30px;
        width: fit-content;
        height: max-content;
        background: #fff;
        border-radius: 15px;
    }

    .show{
        display: flex;
    }
    .modal .btn_box{
        text-align: end;
    }

</style>