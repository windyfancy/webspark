<style>
.md_toolbar ul{
    padding:0px;
}
.md_toolbar li{
    padding:0px;
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
                <li><a href="javascript:" @click="insertCode('bold')">加粗</a></li>
                <li><a href="javascript:" @click="insertCode('italic')">斜体</a></li>
                <li><a href="javascript:" @click="insertCode('ol')">有序列表</a></li>
                <li><a href="javascript:" @click="insertCode('ul')">无序列表</a></li>
                <li><a href="javascript:" @click="insertCode('line')">分隔线</a></li>
                <li><a href="javascript:" @click="insertCode('link')">链接</a></li>
                <li><a href="javascript:" @click="insertCode('quot')">引用</a></li>
                <li><a href="javascript:" @click="insertCode('code')">代码</a></li>
                <li><a href="javascript:" @click="insertCode('table')">表格</a></li>
                <li style="position:relative"><a href="javascript:" @click="insertCode('image')">图片</a>
                    <MarkUpload :uploadUrl="uploadUrl" @progress="uploadProgress" @complete="uploadComplete"> </MarkUpload>
                </li>
            </ul>
        </div>
        <div class="md-editor">
             <textarea v-model="content" :style="{height:height}" ref="textarea" @keyup="onKeyup"/>
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
                default: '400px'
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
                     case "ul":
                      this.insertText("\n* ");
                    break;
                     case "ol":
                     this.insertText("\n1. ");
                    break;
                     case "bold":
                        this.insertText("**","**");
                    break;
                    case "italic":
                        this.insertText("*","*");
                    break;
                     case "link":
                        this.insertText("[Link](http://",")");
                    break;
                     case "line":
                        this.insertText("\n\n---\n");
                    break;
                     case "quot":
                        this.insertText("\n>");
                    break;
                     case "table":
                        this.insertText("\n\nA   | B    | C\n----|----|----\n 1  |","      |    \n  2  |      |     \n")
                     break;
                     case "code":
                        this.insertText("```\n","\n```");
                    break;
                }

            },
            onKeyup(e){
                if(e.keyCode==13){
                    
                    const obj = this.$refs.textarea;
                    let startPos = obj.selectionStart,
                    endPos = obj.selectionEnd;
                    var lineArr=obj.value.substring(0,endPos-1).split("\n");
                    var line=lineArr[lineArr.length-1];
                    var numReg=/(\d+)\. /;
                    if(line.match(/\* /)){
                        this.insertText("* ");
                    }else if(line.match(numReg)){
                        var idx=Number(line.match(numReg)[1]);
                        idx++;
                        this.insertText(idx+". ");
                    }

                }
            },
            insertText(prefix,postfix) {
                if(!postfix){postfix=""}
                const obj = this.$refs.textarea;
                
                if (document.selection) {
                    const sel = document.selection.createRange();
                    sel.text = prefix;
                } else if ( typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number' ) {
                    let startPos = obj.selectionStart,
                        endPos = obj.selectionEnd,
                        cursorPos = startPos,
                        tmpStr = obj.value;
                    let selectText=tmpStr.substring(startPos,endPos);
                    obj.value = tmpStr.substring(0, startPos) + prefix+ selectText+postfix+ tmpStr.substring(endPos, tmpStr.length);
                    cursorPos += prefix.length;

                    obj.selectionStart = obj.selectionEnd = cursorPos;
                } else {
                    obj.value += prefix;
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