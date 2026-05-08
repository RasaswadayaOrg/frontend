with open("/Users/rowneth/3YRResearch/frontend/src/app/page.tsx", "r") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if line.strip() == "return (":
        return_idx = i
        break

head = lines[:return_idx]
print("".join(head))
