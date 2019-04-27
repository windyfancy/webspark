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
                <li><a href="javascript:" @click="insertCode('image')">图片</a>
                    <MarkUpload> </MarkUpload>
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
            config: {
                type: Object,
                default () {
                    return {
                        action: '/',
                        maxSize: 5120
                    }
                }
            },
             height: {
                type: String,
                default: ''
            },
            value: {
                type: String,
                default: ''
            },
            beforeUpload: {
                type: Function,
                default () {
                    return true;
                }
            },
            imgUrl: {
                type: Function,
                default (res) {
                    return res;
                }
            },
            highlight: {
                type: Function,
                default (code) {
                    return code;
                }
            },
            paste: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                tabType: 'write',  // write || preview || summary
                content: this.value,
                showMdTip: false,
                showDiff: false,
                showDiffEditor: false,
                summary: ''
            };
        },
        watch: {
            showDiff (val) {
                // 避免出现输入框的滚动条
                this.$nextTick(() => {
                    this.showDiffEditor = val;
                });
            },
            value (val) {
                this.content = val;
            },
            content (val) {
                 
                this.$emit('input', val);
            }
        },
        computed: {
//            coverUrl () {
//                return config.filePrefix + this.cover + '/large';
//            }
        },
        methods: {
            handleChangeTab (name) {
                if (name === 'write') {
                    this.$nextTick(() => {
                        this.$refs.content.focus();
                    });
                } else if (name === 'preview') {
                    if (this.changeScroll) {
                        this.$nextTick(() => {
                            const md = this.$refs.markdown.$el;
                            window.scrollTo(0, md.offsetTop);
                        });
                    }
                } else if (name === 'summary') {
                    this.$nextTick(() => {
                        this.$refs.summary.focus();
                    });
                }
            },
            insertCode(type){
                 
                switch(type){
                    case "headline":
                        this.insertText("# ");
                    break;
                     case "ol":
                      this.insertText("* ");
                    break;
                     case "li":
                     this.insertText("1. ");
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
            },
            handleUploadSuccess (res) {
//                const url = config.filePrefix + res.key + '/large';
                const url = this.imgUrl(res);
                const md_link = `![](${url})`;
                const $content = this.$refs.content.$refs.textarea;
                this.insertText($content, md_link);
                this.$nextTick(() => {
                    this.content = $content.value;  // 不加此行，改变了 value 不会重绘，原数据则没有改变
                    this.$refs.content.focus();
                });
            },
         
            focus () {
                if (this.$refs.content) {
                    this.$refs.content.focus();
                }
            }
        }
    }
</script>