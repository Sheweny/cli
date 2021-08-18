const { TemplateCopy } = require('../lib/util/copy');
const { join } = require('path')
new TemplateCopy(join(__dirname, './dirTarget'), join(__dirname, './dirTemplate'), { name: 'project_name' })