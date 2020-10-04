const fs = require('fs').promises;
const crypto = require('crypto');

const hash = str => crypto.createHash('md5').update(str).digest("hex");

const formatDir = (root, namespace) => `${root}/${hash(namespace)}/`;

const set = root => async (namespace, key, value) => {
    const dir = formatDir(root, namespace);
    const file = hash(key);
    await fs.mkdir(dir, { recursive:true });
    await fs.writeFile( dir + file ,value, 'utf-8');
    return { namespace, key };
}

const get = root => async (namespace, key) => {
    const dir = formatDir(root, namespace);
    const file = hash(key);
    const value = await fs.readFile( dir + file, 'utf-8')
    return { namespace, key, value };
}

const del = root => async (namespace, key) => {
    const dir = formatDir(root, namespace);
    const file = hash(key);
    await fs.unlink(dir + file);
    return {};
}

const init = (root) => ({
    set: set(root),
    get: get(root),
    del: del(root)
});

module.exports = { 
    init
};