@echo off
echo ================================
echo Snake Rescue Platform Setup
echo ================================
echo.

echo Step 1/4: Installing root dependencies...
call yarn install
if errorlevel 1 (
    echo Failed to install root dependencies
    exit /b 1
)
echo Root dependencies installed
echo.

echo Step 2/4: Installing UI library dependencies...
cd libs\frontend\ui
call yarn install
if errorlevel 1 (
    echo Failed to install UI library dependencies
    exit /b 1
)
cd ..\..\..
echo UI library dependencies installed
echo.

echo Step 3/4: Installing frontend app dependencies...
cd apps\frontend
call yarn install
if errorlevel 1 (
    echo Failed to install frontend app dependencies
    exit /b 1
)
cd ..\..
echo Frontend app dependencies installed
echo.

echo Step 4/4: Building shared library...
call yarn build:shared
if errorlevel 1 (
    echo Failed to build shared library
    exit /b 1
)
echo Shared library built
echo.

echo ================================
echo All dependencies installed!
echo ================================
echo.
echo You can now run:
echo   yarn dev:frontend    - Start frontend
echo   yarn dev             - Start both
echo   yarn build:all       - Build everything
echo.
pause
