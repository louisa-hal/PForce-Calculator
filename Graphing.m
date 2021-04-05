%Hitpoints for th = 0
datax0 = fileread('xvalues0.txt');
datay0 = fileread('yvalues0.txt');
dataz0 = fileread('zvalues0.txt');

%Hitpoints for th = 90
datax90 = fileread('xvalues90.txt');
datay90 = fileread('yvalues90.txt');
dataz90 = fileread('zvalues90.txt');

%Hitpoints for th = 180
datax180 = fileread('xvalues180.txt');
datay180 = fileread('yvalues180.txt');
dataz180 = fileread('zvalues180.txt');

%Force
dataFx = fileread('FSRPx copy.txt');
dataFy = fileread('FSRPy copy.txt');
dataFz = fileread('FSRPz copy.txt');


x0 = str2num(datax0);
y0 = str2num(datay0);
z0 = str2num(dataz0);

x90 = str2num(datax90);
y90 = str2num(datay90);
z90 = str2num(dataz90);

x180 = str2num(datax180);
y180 = str2num(datay180);
z180 = str2num(dataz180);

xForce = str2num(dataFx);
yForce = str2num(dataFy);
zForce = str2num(dataFz);
angle = 0:2:180;


figure(1)
scatter3(x0,y0,z0, 'filled')
title('intersections for pixel array angle at 0deg')
xlabel ('x')
ylabel('y')
zlabel('z')
xlim([-1.2,1.2]);
ylim([-1.2,1.2]);
zlim([-1.2,1.2]);
axis equal
grid on
grid minor


figure(2)
scatter3(x90, y90, z90, 'filled')
title('intersections for pixel array angle at 90deg')
xlabel ('x')
ylabel('y')
zlabel('z')
xlim([-1.2,1.2]);
ylim([-1.2,1.2]);
zlim([-1.2,1.2]);
axis equal
grid on
grid minor

figure(3)
scatter3(x180, y180, z180, 'filled')
title('intersections for pixel array angle at 180deg')
xlabel ('x')
ylabel('y')
zlabel('z')
xlim([-1.2,1.2]);
ylim([-1.2,1.2]);
zlim([-1.2,1.2]);
axis equal
grid on
grid minor

figure(4)
plot(angle, xForce)
hold on
plot(angle, yForce)
hold on
plot(angle, zForce)
hold off
title('x, y and z components of the acceleration vector')
xlabel ('angle')
ylabel('acceleration')
legend('xForce','yForce','zForce')
grid on
grid minor
