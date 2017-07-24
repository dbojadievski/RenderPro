import time
import datetime
import os
import threading
import webbrowser

print("Building RenderPro.");
commentStrings 		= []
commentStrings.append("/* @file version.js */\n")
commentStrings.append("/* @author Dino 'Sourcery' Bojadjievski, Martin 'Shinjirius' De Jong */\n")
commentStrings.append("")
now 				= datetime.datetime.now()
content 			= "var builtAt = \"" + now.strftime("%Y-%m-%d %H:%M:%S\"") + ";\n"
log = "console.log(\"Running build \" + builtAt)"

path 				= os.path.join( "built", 'version.js');
print path
file_object 		= open( path, 'w')
for comment in commentStrings:
	file_object.write(comment)
file_object.write(content)
file_object.write(log)
file_object.flush()
file_object.close

print("Build Complete.")
# webbrowser.open_new_tab("http://localhost:8082")
os.system("python -m SimpleHTTPServer 8082" )


"Running build " + builtAt