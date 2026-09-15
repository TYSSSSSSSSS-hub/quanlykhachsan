@echo off
setlocal
set JAVA_TOOL_OPTIONS=-Dfile.encoding=UTF-8
set MAVEN_HOME=%~dp0.mvn\apache-maven-3.9.6
"%MAVEN_HOME%\bin\mvn.cmd" %*
