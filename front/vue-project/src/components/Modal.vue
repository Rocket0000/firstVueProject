<script setup>
import { reactive, ref, watch } from 'vue';
import Table from './Table.vue';

const props = defineProps({
    title: String,
    desc: String,
    btnType: {
        type: String,
        default: ""
    },
    isOpen:{
        type: Boolean,
        default: false
    },
    modalType: {
        type: String,
        default: "default" || undefined
    },
    tbProps: Object
})

const tableProps = ref({...props.tbProps})
const emit = defineEmits(["confirm", "update:isOpen"]);
const innerOpen = ref(false);

function isConfirm(){
    emit("confirm");
    emit("update:isOpen", false);
    innerOpen.value = false;
}

function isCancel(){
    emit("update:isOpen", false);
    innerOpen.value = false;
}


watch([() => props.isOpen, () => props.tbProps], ([newVal, newTBVal])=> {
    innerOpen.value = newVal;
    if((typeof tableProps !== "undefined" || tableProps != {}) && props.modalType === "tb"){
        tableProps.value = newTBVal;
    }
})

</script>

<template>
    <div class="modal_wrapper" :class="{show: innerOpen}">
        <div class="modal">
            <div v-if="modalType === 'default'">
                <h2>{{title}}</h2>
                <p v-if="desc">{{ desc }}</p>
            </div>
            <div v-else-if="modalType === 'tb'">
                <h2>{{title}}</h2>
                <Table 
                    v-bind="tableProps"
                    v-model:row-items="tableProps.rowItems"
                    className="modal_tb"
                />
            </div>
            <div v-else-if="modalType === 'el'">
                <h2>{{title}}</h2>
                <slot/>
            </div>
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

    .modal_tb{
        width: 50vw;
        height: 300px;
        margin-bottom: 20px;
    }

</style>