/* async：要求为Boolean类型的参数，默认设置为true，所有请求均为异步请求。
 * 该函数的主要功能：封装了同步，异步ajax传输：POST方式，GET方式，DELETE方式，PUT方式）
 * author:heshengjin
 * date:2018-11-08
 * 
 * 
 * 参数解释：
 * url：发送请求的url地址
 * data：传递的参数集合
 * sucessFun：处理提交成功的回调函数-result参数={
		                                 codeStatus: 1,
									     message: "操作成功",
									     data: {xxx}
	   									}
 * failureFun：处理提交失败的回调函数-result参数={
		                                 codeStatus: 1,
									     message: "操作成功",
									     data: {xxx}
	   									}
 * 
 *  
 *   //测试异步代码
    $.httpRequestAsyncPost("http://localhost:8080/orgPublicCourse/publicaccess/selectOrgPublicCourseListByMode?currentPage=1&pageSize=4&mode=4&maxPrice=349&minPrice=12&timeSort=1&relatedCom=0",
    		{},
    		function(result){
    			console.log(result);
    		},
    		function(result){
    			console.log(result);
    		});
    
    
    
    
    
    result参数={
		    codeStatus: 1,
			message: "操作成功",
			data: {xxx}
	   		  }
   //测试同步代码
    var result = $.httpRequestPost("http://localhost:8080/orgPublicCourse/publicaccess/selectOrgPublicCourseListByMode?currentPage=1&pageSize=4&mode=4&maxPrice=349&minPrice=12&timeSort=1&relatedCom=0",
    		{});
    console.log(result);
 */ 
jQuery.extend({
	//异步
	_httpRequestAsyncajax:function(method,url,data,sucessFun,failureFun){
		var returnValue;
		var aurl= url?url:'';
		if(aurl==''){
			console.log('缺少参数url');
			return;
		}
		var bHasSucFun=sucessFun?true:false;
		var bHasFailFun=failureFun?true:false;

		function defaultSucFun(result){
			console.log('操作成功!'+result);
		}
		function defaultFaiFun(result){
			console.log('操作失败!'+result);
		}
		var adata= data?data:{};
		var asucessFun= sucessFun?sucessFun:defaultSucFun;
		var afailureFun= failureFun?failureFun:defaultFaiFun;
		$.ajax({   
		    url:aurl,   
		    type:method,
		    async:true,
		    data:adata,
		    beforeSend: function(request) {
                      request.setRequestHeader("Authorization", "Bearer "+Cookies.get("token"));
                    },
		    success :function(result){
		    	var rlt=result;
		    	asucessFun(rlt);
		    },
		    error:function(err){   
		    	console.log("failed!");  
		    	afailureFun(err);
	       }});
	},
	//同步
	_httpRequestAjax:function(method,url,data){
		var returnValue = "";
		var aurl= url?url:'';
		if(aurl==''){
			console.log('缺少参数url');
			return returnValue;
		}
		var adata= data?data:{};
		$.ajax({
		    url:aurl,
		    type:method,
		    async:false,
		    data:adata,
	            beforeSend: function(request) {
                     request.setRequestHeader("Authorization", "Bearer "+Cookies.get("token"));
                    },
		    success :function(result){
		    	returnValue=result;
		    },
		    error:function(){
		    	console.log("request error!");
		        return returnValue;
	       }});
		return returnValue;
	},
	//异步ajax方法
	httpRequestAsyncPost:function(url,data,sucessFun,failureFun){
		this._httpRequestAsyncajax("post", url, data, sucessFun, failureFun);
	},
	httpRequestAsyncGET:function(url,data,sucessFun,failureFun){
		this._httpRequestAsyncajax("get", url, data, sucessFun, failureFun);
	},
	httpRequestAsyncDelete:function(url,data,sucessFun,failureFun){
		this._httpRequestAsyncajax("delete", url, data, sucessFun, failureFun);
	},
	httpRequestAsyncPut:function(url,data,sucessFun,failureFun){
		this._httpRequestAsyncajax("put", url, data, sucessFun, failureFun);
	},

	//同步ajax方法
	httpRequestPost:function(url,data){
		return this._httpRequestAjax("post", url, data);
	},
	httpRequestGet:function(url,data){
		return this._httpRequestAjax("get", url, data);
	},
	httpRequestDelete:function(url,data){
		return this._httpRequestAjax("delete", url, data);
	},
	httpRequestPut:function(url,data){
		return this._httpRequestAjax("put", url, data);
	},
	//=================分页控件==目前仅仅支持GET=====http格式：http://localhost:8080/xxx/_pageindex/_pagesize?param1=xxx&param2=yyy==========
	/**参数说明：
	 * _url:http://localhost:8080/xxx/   ----------->>>>>>>>>>url前缀
	 * _form:?param1=xxx&param2          ----------->>>>>>>>>>?后面的参数
	 * parfunc:                          ----------->>>>>>>>>>ajax回调函数-参数就是后台封装的返回格式
	 * _pageindex：                      ----------->>>>>>>>>>当前页码
	 * _pagesize：                       ----------->>>>>>>>>>页码大小
	 * _index:                           ----------->>>>>>>>>>可以忽略，不用理会，传参undefined即可
	 * ex：                              ----------->>>>>>>>>>html该分页节点处的dom树ID
	 * 
	 * 
	 * 
	 * 使用：
	 * <link href="${GLOB_HOME}/static/css/style.css" rel="stylesheet">
	 * <link href="${GLOB_HOME}/static/css/zui.min.css" rel="stylesheet">
	 * 
	 * 
	  <div class="pager-box">
      	 <ul class="pager" id="page_1">
		 </ul>
      </div>  
      
	   var search ="search-搜索";
	   $.getpage("http://localhost:8080/orgPublicCourse/publicaccess/selectOrgPublicCourseListByMode/",
			  escape('{"mode":"'+4+'","timeSort":"'+1+'","relatedCom":"'+0+'","maxPrice":"'+349+'","minPrice":"'+12+'","type":"'+888+'","search":"'+search+'"}'),
			  'myfunc',1,5,undefined,"#page_1");
	  function myfunc(dd){
	    console.log(dd)
	  } 
	  **/
	getpage: function (_url,_form,parfunc,_pageindex,_pagesize,_index,ex) {  //获取公用分页入口
		
		//保证记住当前页码     key=location.href+"_"+parfunc
		//              value=_pageindex+":"+_pagesize
		// window.localStorage.setItem(parfunc,_pageindex);
		 
		 var pagesize=parseInt(_pagesize); 
		 var pageindex=parseInt(_pageindex);
		 var url=_url +(pageindex)+"/"+pagesize+"?times=" + new Date().getMilliseconds();
		 var form= _form != undefined && _form != "" && _form != null && _form != "undefined" ?(unescape(_form).indexOf("{")>=0 || _form.indexOf("{")>=0 ?(unescape(_form).indexOf("{")>=0 ? eval("("+unescape(_form)+")") : eval("("+_form+")")) : $.serializeMVC($(_form).serializeArray())):{};
		 
		 //特殊处理
		 if(parfunc == "pCourseListfunc"){
			 window.localStorage.setItem("pCourseListfunc_pageindex",pageindex);
			 window.localStorage.setItem("pCourseListfunc_param",JSON.stringify(form));
		 }
		 
		$.ajax({
	        type: "Get",
	        cache: false,
	        async: true,
	        url:   url,
	        data:  form,
		beforeSend: function(request) {
                  request.setRequestHeader("Authorization", "Bearer "+Cookies.get("token"));
                },
	        success: function (data) {
	        	 var map=data;
	        	 if(map.codeStatus==1){
		        	 var total=parseInt(parseInt(map.data.total)/pagesize)+(parseInt(map.data.total)%pagesize==0? 0:1);		        	 
		        	 if(_index!=undefined && _index!=null && _index!='undefined'){
		        		 if(ex){
			        		$(ex).eq(parseInt(_index)-1).html($.page(_url,_form,total,_pageindex,pagesize,parfunc,map.data.total,_index,ex)); 
			        	  }else{
			        	        $('.pager').eq(parseInt(_index)-1).html($.page(_url,_form,total,_pageindex,pagesize,parfunc,map.data.total,_index,ex));
			        	  }
		        	 }else{
		        		 if(ex){
		        			 $(ex).html($.page(_url,_form,total,_pageindex,pagesize,parfunc,map.data.total,_index,ex));
		        		}else{
		        			 $('.pager').html($.page(_url,_form,total,_pageindex,pagesize,parfunc,map.data.total,_index,ex));
		        		}
		        	 }
		        	 
		        	 var func=eval("("+parfunc+")");
		        	 func(map);
	        	 }else{
	        		 var msg=map.message != undefined && map.message != "" && map.message != null && map.message != "undefined"? map.message:"分页查询失败！";
	        		 var func=eval("("+parfunc+")");
		        	 func(map);
	        	 }
	        },
	        error: function (XMLHttpRequest, textStatus, errorThrown) {
	        	console.log(errorThrown);
	        }
	    });
	},
	page: function (url,form,pagescount,_pageindex,pagesize,parfunc,total,_index,ex){
		 var pageindex=parseInt(_pageindex)<=0? 1:_pageindex;
		 var result="";
		 ex = ex || "";
		 if (pagescount > 1)
	     {
	         if (pageindex== 1)
	         {
	             result+="<li class=\"\">";
	             result+="<a style=\"color:#E6E2E2;border-color: #F9F3F3;\">&lt;&lt;</a>";
	             result+="</li>";
	             result+="<li  class=\"\">";
	             result+="<a style=\"color:#E6E2E2;border-color: #F9F3F3;\">上一页</a>";
	             result+="</li>";
	         }
	         else
	         {
	             result+="<li class=\"\">";
	             result+="<a href=\"javascript:void(0)\"  title=\"首页\" onclick=\"$.getpage('"+url+"','"+form+"','"+parfunc+"',1,"+pagesize+","+_index+",\'"+ex+"\')\">&lt;&lt;</a>";
	             result+="</li>";
	             result+="<li class=\"\">";
	             result+="<a href=\"javascript:void(0)\"   title=\"上一页\" onclick=\"$.getpage('"+url+"','"+form+"','"+parfunc+"',"+(pageindex-1)+","+pagesize+","+_index+",\'"+ex+"\')\">上一页</a>";
	             result+="</li>";
	         }
	         for (var i = 1; i <=pagescount; i++)
	         {
	             //内容页  总的要存在9页

	             if (pagescount- pageindex >8)
	             {
	                 if (i ==pagescount - 2)
	                 {
	                     result+="<li class=\"\">";
	                     result+="<a href=\"javascript:void(0)\" class=\"\" onclick=\"$.getpage('"+url+"','"+form+"','"+parfunc+"',"+(pageindex)+","+pagesize+","+_index+",\'"+ex+"\')\">…</a>";
	                     result+="</li>";
	                     continue;
	                 }
	                 if (i >=pageindex && (i - pageindex < 8 || pagescount - 1 < i))
	                 {
	                     if (i==pageindex)
	                     {
	                         result+="<li class=\"active\">";
	                         result+="<a href=\"javascript:void(0)\" class=\"active\"";
	                     }
	                     else
	                     {
	                         result+=" <li class=\"\">";
	                         result+="<a href=\"javascript:void(0)\" class=\"\" onclick=\"$.getpage('"+url+"','"+form+"','"+parfunc+"',"+i+","+pagesize+","+_index+",\'"+ex+"\')\"";
	                     }
	                     result+=">" + i + "</a>";
	                     result+="</li>";
	                 }
	             }
	             else
	             {
	                 if (pagescount - i < 9)
	                 {
	                     if (i==pageindex)
	                     {
	                         result+=" <li class=\"active\">";
	                         result+="<a href=\"javascript:void(0)\" class=\"active\"";
	                     }
	                     else
	                     {
	                         result+="<li class=\"\">";
	                         result+="<a href=\"javascript:void(0)\" class=\"\" onclick=\"$.getpage('"+url+"','"+form+"','"+parfunc+"',"+i+","+pagesize+","+_index+",\'"+ex+"\')\"";
	                     }
	                     result+=">" + i + "</a>";
	                     result+="</li>";
	                 }
	             }
	         }
	         //下一页
	         if (pageindex==pagescount)
	         {
	             result+=" <li class=\"\"><a  style=\"color:#E6E2E2;border-color: #F9F3F3;\" title=\"下一页\" >下一页</a></li>";
	             result+=" <li class=\"\"><a  style=\"color:#E6E2E2;border-color: #F9F3F3;\" title=\"尾页\">&gt;&gt;</a></li>";
	         }
	         else
	         {
	             result+="<li class=\"\">";
	             result+="<a href=\"javascript:void(0)\"  title=\"下一页\"  onclick=\"$.getpage('"+url+"','"+form+"','"+parfunc+"',"+(pageindex+1)+","+pagesize+","+_index+",\'"+ex+"\')\">下一页</a>";
	             result+="</li>";
	             result+="<li class=\"\">";
	             result+="<a href=\"javascript:void(0)\" title=\"尾页\"  onclick=\"$.getpage('"+url+"','"+form+"','"+parfunc+"',"+pagescount+","+pagesize+","+_index+",\'"+ex+"\')\">&gt;&gt;</a>";
	             result+="</li>";
	         }
	     }else
	     {
	         result="";
	     }
		 return result;
	},

	
});