<template>
   <div style="position:absolute;top:0px;">
       <input type="file" style="width:100%;opacity:0" @change="fileSelect">
   </div>
</template>
<script>
    export default {
        props: {
            uploadUrl: {
                type: String,
                default: 'select'
            },
            type: {
                type: String,
                default: 'select'
            },
            /**
             * 1: 编辑器的上传
             * 2: 发文章时的封面大图
             * 3: 编辑器的拖拽上传
             * 4: 上传用户封面
             * 5: 上传用户头像
             * 6: 上传 markdown 文件
             */
            styles: {
                type: Number,
                default: 0
            },
            cover: String,
            // 为 true 时，是设置头像、封面，获取token的链接不同
            info: {
                type: Boolean,
                default: false
            },
            // styles 为 5 时使用
            showBtn: Boolean,
            config: Object,
            beforeUpload: Function,
            paste: Boolean
        },
        data () {
            return {
                uploadForm: {},
                uploadPercent: 0,
                uploadStatus: 0,  // 0未上传，1上传中
                noUploadAccess: false
            };
        },
        computed: {
        },
        methods: {
            fileSelect(e){
                var self=this;
                var file=event.target.files[0];
                var url = this.uploadUrl;
                var xhr=new XMLHttpRequest();
                xhr.upload.onprogress = function (e) {
                    var percent=(e.loaded/e.total)*100
                    console.log(percent);
                    self.$emit("progress",{percent:percent});
                   
                }
                xhr.onreadystatechange = function (oEvent) {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        debugger;
                        var responseText = xhr.responseText;
                        self.$emit("complete",{response:responseText});
                        
                    }
                };

                xhr.open("POST", url, true);

                function getFormData(fileInfo) {
                    var formData = new FormData();
                    formData.append("file", fileInfo);
                    return formData;
                }
                var fd = getFormData(file);
                xhr.send(fd);
            }
          
        }
    };
</script>