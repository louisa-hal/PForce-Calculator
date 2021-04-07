%Hitpoints for th = 0
datax0 = fileread('xvalues0.txt');
datay0 = fileread('yvalues0.txt');
dataz0 = fileread('zvalues0.txt');

%Hitpoints for th = 45
datax45 = fileread('xvalues45.txt');
datay45 = fileread('yvalues45.txt');
dataz45 = fileread('zvalues45.txt');

%Hitpoints for th = 90
datax90 = fileread('xvalues90.txt');
datay90 = fileread('yvalues90.txt');
dataz90 = fileread('zvalues90.txt');

%Hitpoints for th = 180
datax180 = fileread('xvalues180.txt');
datay180 = fileread('yvalues180.txt');
dataz180 = fileread('zvalues180.txt');

%Force
dataAx = fileread('aSRPx.txt');
dataAy = fileread('aSRPy.txt');
dataAz = fileread('aSRPz.txt');


x0 = str2num(datax0);
y0 = str2num(datay0);
z0 = str2num(dataz0);

x45 = str2num(datax45);
y45 = str2num(datay45);
z45 = str2num(dataz45);

x90 = str2num(datax90);
y90 = str2num(datay90);
z90 = str2num(dataz90);

x180 = str2num(datax180);
y180 = str2num(datay180);
z180 = str2num(dataz180);

xAccel= str2num(dataAx);
yAccel = str2num(dataAy);
zAccel = str2num(dataAz);
angle = 0:2:180;


figure(1)
scatter3(x0,y0,z0, 'filled')
title('Intersections of Cannonball with Pixel Array Angle at 0deg')
xlabel ('x')
ylabel('y')
zlabel('z')
xlim([-1.5,1.5]);
ylim([-1.5,1.5]);
zlim([-1.5,1.5]);
axis equal
grid on
grid minor


figure(2)
scatter3(x45,y45,z45, 'filled')
title('Intersections of Cannonball with Pixel Array Angle at 45deg')
xlabel ('x')
ylabel('y')
zlabel('z')
xlim([-1.5,1.5]);
ylim([-1.5,1.5]);
zlim([-2,2]);
axis equal
grid on
grid minor


figure(3)
scatter3(x90, y90, z90, 'filled')
title('Intersections of Cannonball with Pixel Array Angle at 90deg')
xlabel ('x')
ylabel('y')
zlabel('z')
xlim([-1.5,1.5]);
ylim([-1.5,1.5]);
zlim([-1.5,1.5]);
axis equal
grid on
grid minor

figure(4)
scatter3(x180, y180, z180, 'filled')
title('Intersections of Cannonball with Pixel Array Angle at 180deg')
xlabel ('x')
ylabel('y')
zlabel('z')
xlim([-1.5,1.5]);
ylim([-1.5,1.5]);
zlim([-1.5,1.5]);
axis equal
grid on
grid minor

figure(5)
plot(angle, xAccel, 'LineWidth',3)
hold on
plot(angle, yAccel, 'LineWidth',3)
hold on
plot(angle, zAccel, 'LineWidth',3)
hold off
title('The x, y and z Components of the Resultant Acceleration Vector')
xlabel ('Angle, θ (degrees)')
ylabel('Acceleration, m/s^2)')
legend('xAcceleration','yAcceleration','zAcceleration')
grid on
grid minor
