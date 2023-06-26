#!/bin/zsh
project=${PWD##*/}
echo "$project"
sed -i "s/nextjs-template/$project/g" ./supabase/config.toml
sed -i "s/Template/$project/g" ./src/components/layout/Footer.tsx
sed -i "s/Template/$project/g" ./src/components/layout/Navbar.tsx
sed -i "s/Template/$project/g" ./src/app/page.stories.ts
sed -i "s/Template/$project/g" ./src/app/layout.tsx
sed -i "s/Template/$project/g" ./e2e/layout.spec.ts
sed -i "s/template/$project/g" ./package.json
