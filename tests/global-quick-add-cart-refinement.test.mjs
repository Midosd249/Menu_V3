  assert.match(themeRecovery, /\.public-menu-quick-add/);
  assert.match(themeRecovery, /min-height: 44px/);
  assert.match(themeRecovery, /env\(safe-area-inset-bottom\)/);
});

test("quick-add actions are sibling interactive controls, never nested buttons", () => {
  assert.doesNotMatch(publicMenu, /<button[^>]*>[\s\S]*<button[^>]*className="public-menu-quick-add/);
  assert.doesNotMatch(contemporary, /<button[^>]*>[\s\S]*<button[^>]*className="public-menu-quick-add/);
});