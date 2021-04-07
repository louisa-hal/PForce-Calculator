# PForce-Calculator
Dev of online tool to calculate Radiation Pressure forces on Resident Space Objects (RSO's), such as space craft.

User guide:

Inputs (variables):
- angle: rotation from +y around the x axis can be inputted as the angle variable in degree
- axis: Can change the rotational axis from the x axis by putting a 1 value in x, y or z.
- start/stopno - Limits of pixel array
- step - Resolution of the pixel array
- radIn - cannonball radius
- m: cannonball mass
- v: cannonball reflectivity
- u: cannonball specularity


Notes:
When changing the plane rotational axis, the initial plane normal value must be changed in line 53.
The outputted values are non-precise due to a compression error when rotating the pixel array.
Data extraction pop up windows are size limited.


