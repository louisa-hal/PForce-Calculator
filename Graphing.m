datax = fileread('xvalues.txt');
dataz = fileread('zvalues.txt');

x = str2num(datax);
z = str2num(dataz)


scatter(x,z)
xlabel ('x')
ylabel('z')