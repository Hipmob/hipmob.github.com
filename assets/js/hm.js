var hm = hm || (function($){
    var self = {};
    var siteurl = "";

    var path = function()
    {
	var args = arguments, result = [];
	
	for(var i = 0; i < args.length; i++){
	    result.push(args[i].replace('@', siteurl+'/assets/sh/scripts/'));
	}
	
	return result;
    };
    
    self['setup'] = function(baseurl)
    {
	siteurl = baseurl;
	SyntaxHighlighter.autoloader.apply(null, path(
	    'applescript            @shBrushAppleScript.js',
	    'actionscript3 as3      @shBrushAS3.js',
	    'bash shell             @shBrushBash.js',
	    'coldfusion cf          @shBrushColdFusion.js',
	    'cpp c                  @shBrushCpp.js',
	    'c# c-sharp csharp      @shBrushCSharp.js',
	    'css                    @shBrushCss.js',
	    'delphi pascal          @shBrushDelphi.js',
	    'diff patch pas         @shBrushDiff.js',
	    'erl erlang             @shBrushErlang.js',
	    'groovy                 @shBrushGroovy.js',
	    'java                   @shBrushJava.js',
	    'jfx javafx             @shBrushJavaFX.js',
	    'js jscript javascript  @shBrushJScript.js',
	    'perl pl                @shBrushPerl.js',
	    'php                    @shBrushPhp.js',
	    'text plain             @shBrushPlain.js',
	    'py python              @shBrushPython.js',
	    'ruby rails ror rb      @shBrushRuby.js',
	    'sass scss              @shBrushSass.js',
	    'scala                  @shBrushScala.js',
	    'sql                    @shBrushSql.js',
	    'vb vbnet               @shBrushVb.js',
	    'xml xhtml xslt html    @shBrushXml.js'
	));
	SyntaxHighlighter.all();
    };
    return self;
})(jQuery);

function gotoLogin()
{
    document.location = "https://manage.hipmob.com/";
}

/*
jQuery(function() {
    var $window = jQuery(window);
    var $mainbar = jQuery('.mainbar').eq(0);
    var isBig = true;
    var scrollTop = 0;
    
    $window.scroll(function() {
        scrollTop = $window.scrollTop();
        
        if (scrollTop > 65) {
            if (isBig) {
		$mainbar.css('height', '77px');
		$mainbar.css('padding-top', '22px');
		isBig = false;
            }
        } else if (scrollTop < 55) {
            if (!isBig) {
		$mainbar.css('height', '105px');
		$mainbar.css('padding-top', '41px');
		isBig = true;
            }
        }
    });
});
*/