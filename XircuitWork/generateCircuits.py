from xircuits.compiler import create_xircuits_from_components
from components import ReadJSON, GenerateSchedule

# Create the Xircuits flow
xircuits_code = create_xircuits_from_components([
    ReadJSON(),
    GenerateSchedule()
])

# Save to file
with open("workflow.xircuits", "w") as f:
    f.write(xircuits_code)

print("Xircuits workflow generated as workflow.xircuits")
