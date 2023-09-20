echo "POST-CREATE-CHOWN STARTING ⏳"

echo "DOING >> sudo chown -R node:node node_modules"
sudo chown -R node:node node_modules
echo "DOING >> sudo chown -R node:node .pnpm-store"
sudo chown -R node:node .pnpm-store

echo "POST-CREATE-CHOWN ENDED 🎉"
