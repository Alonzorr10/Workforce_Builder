import xpress as xp

xp.init('C:/Users/alonz/AppData/Local/Packages/PythonSoftwareFoundation.Python.3.11_qbz5n2kfra8p0/LocalCache/local-packages/Python311/site-packages/xpress/license/community-xpauth.xpr')

# Create a simple linear optimization problem
model = xp.problem()

# Define decision variables
x = model.addVariable('x', lb=0, ub=10)
y = model.addVariable('y', lb=0, ub=10)

# Add an objective function
model.setObjective(5 * x + 4 * y, sense= 1)

# Add a constraint
model.addConstraint(x + y <= 15)

# Solve the problem
model.solve()

# Get the solution
print(f"Optimal solution: x = {x.value}, y = {y.value}")
