<style>
.md_toolbar li{
    display: inline-block;
}
.md-editor {
    display: inline-block;
    width:49%;
}
.md-preview {
    display: inline-block;
    width:50%;
    height:100%;
    vertical-align: top;
    padding:5px;
    overflow: auto;
    border:1px solid lightgray;
}
.md-preview ul>li {
    list-style-type: disc;
}
.md-preview ol>li {
    list-style-type: decimal;
}

.md-editor textarea{
    width:100%;
}
</style>
<template>
    <div >
        <div class="md_toolbar">
            <ul>
                <li><a href="javascript:" @click="insertCode('headline')">标题</a></li>
                <li><a href="javascript:" @click="insertCode('ol')">列表</a></li>
                <li><a href="javascript:" @click="insertCode('li')">列表</a></li>
                <li><a href="javascript:" @click="insertCode('bold')">加粗</a></li>
                <li style="position:relative"><a href="javascript:" @click="insertCode('image')">图片</a>
                    <MarkUpload :uploadUrl="uploadUrl" @progress="uploadProgress" @complete="uploadComplete"> </MarkUpload>
                </li>
            </ul>
        </div>
        <div class="md-editor">
             <textarea v-model="content" :style="{height:height}" ref="textarea"/>
        </div><div class="md-preview" :style="{height:height}">
        <MarkPreview :content="content" :highlight="highlight" ref="Markdown">
        </MarkPreview>
        </div>
    </div>
</template>
<script>
    import MarkUpload from './mark.upload.vue';
    import MarkPreview from './mark.preview.vue';
    export default {
        name: 'MarkEditor',
        components: { MarkUpload, MarkPreview },
        props: {
            height: {
                type: [String],
                default: ''
            },
            uploadUrl: {
                type: String,
                default: ''
            },
            value: {
                type: String,
                default: ''
            }

        },
        data () {
            return {
                content: this.value,
            };
        },
        watch: {
            value (val) {
                this.content = val;
            },
            content (val) {
                 
                this.$emit('input', val);
            }
        },

        methods: {
            uploadComplete(e){
                this.$emit("uploadComplete",e);
                if(e.returnValue){
                    var imgCode="![]("+e.returnValue+")"
                    this.insertText(imgCode);
                }
                
            },
            insertCode(type){
                 
                switch(type){
                    case "headline":
                        this.insertText("\n# ");
                    break;
                     case "ol":
                      this.insertText("\n* ");
                    break;
                     case "li":
                     this.insertText("\n1. ");
                    break;
                     case "bold":
                     this.insertText("****");
                     
                    break;
                }

            },
            insertText(str) {
                const obj = this.$refs.textarea;
                if (document.selection) {
                    const sel = document.selection.createRange();
                    sel.text = str;
                } else if ( typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number' ) {
                    let startPos = obj.selectionStart,
                        endPos = obj.selectionEnd,
                        cursorPos = startPos,
                        tmpStr = obj.value;
                    obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
                    cursorPos += str.length;
                    obj.selectionStart = obj.selectionEnd = cursorPos;
                } else {
                    obj.value += str;
                }
                this.content=obj.value;
                this.$nextTick(() => {
                    obj.focus();
                });
            },
            focus () {
                const obj = this.$refs.textarea;
                this.$nextTick(() => {
                    obj.focus();
                });
            }
        }
    }
</script>