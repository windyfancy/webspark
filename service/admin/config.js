
module.exports= {  
    async onLoad() { 
        var allow=await this.checkPermission(1);
        return allow;
    },
    getThemes() {  
        this.database.select("wb_config",{configKey:"theme"}).then((res)=>{
            var theme="default";
            if(res.length>0){
                theme=res[0]["configValue"];
            }
            var result={
                theme: theme,
                themesList:this.config.themesList
            }
            this.render(JSON.stringify(result,null,4));
        })
        
         
    },
    setTheme() {  
        var data=this.request.data;
        this.database.replace("wb_config",{configKey:"theme",configValue:data.theme}).then(()=>{
          
            this.response.body=JSON.stringify({code:"ok"})
        })
         
        
    } 
  }