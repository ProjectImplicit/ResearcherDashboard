<script type="text/javascript">

function gup( name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}

function changeIt(val)
// changed Mar 25, 2002: added if on 122 and else block on 129 to exclude Unicode range
{
var state = "none"
var len     = val.length;
var backlen = len;
var i       = 0;

var newStr  = "";
var frag    = "";
var encval  = "";
var original = val;

if (state == "none") // needs to be converted to normal chars
   {
     while (backlen > 0)
           {
             lastpercent = val.lastIndexOf("%");
             if (lastpercent != -1) // we found a % char. Need to handle
                {
                  // everything *after* the %
                  frag = val.substring(lastpercent+1,val.length);
                  // re-assign val to everything *before* the %
                  val  = val.substring(0,lastpercent);
                  if (frag.length >= 2) // end contains unencoded
                     {
                     //  alert ("frag is greater than or equal to 2");
                       encval = frag.substring(0,2);
                       newStr = frag.substring(2,frag.length) + newStr;
                       //convert the char here. for now it just doesn't add it.
                       if ("01234567890abcdefABCDEF".indexOf(encval.substring(0,1)) != -1 &&
                           "01234567890abcdefABCDEF".indexOf(encval.substring(1,2)) != -1)
                          {
                           encval = String.fromCharCode(parseInt(encval, 16)); // hex to base 10
                           newStr = encval + newStr; // prepend the char in
                          }
                       // if so, convert. Else, ignore it.
                     }
                  // adjust length of the string to be examined
                  backlen = lastpercent;
                 // alert ("backlen at the end of the found % if is: " + backlen);
                }
            else { newStr = val + newStr; backlen = 0; } // if there is no %, just leave the value as-is
           } // end while
   }         // end 'state=none' conversion
else         // value needs to be converted to URL encoded chars
   {
    for (i=0;i<len;i++)
        {
          if (val.substring(i,i+1).charCodeAt(0) < 255)  // hack to eliminate the rest of unicode from this
             {
              if (isUnsafe(val.substring(i,i+1)) == false)
                 { newStr = newStr + val.substring(i,i+1); }
              else
                 { newStr = newStr + convert(val.substring(i,i+1)); }
             }
          else // woopsie! restore.
             {
               alert ("Found a non-ISO-8859-1 character at position: " + (i+1) + ",\nPlease eliminate before continuing.");
               document.forms[0].state.value = "none";
               document.forms[0].enc[0].checked = true; // set back to "no encoding"
               newStr = original; i=len;                // short-circuit the loop and exit
             }
        }

   }
   if(newStr=="")
    {document.write("No errors were detected");}
   document.write(newStr);
}


changeIt(gup('E'));


</script>