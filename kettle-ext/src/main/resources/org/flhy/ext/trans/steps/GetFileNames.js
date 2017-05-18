/**
 * 获取文件名
 * 20160627 add by xqj
 */
GetFileNamesDialog = Ext.extend(Ext.Window, {
	title: '获取文件名',
	width: 700,
	height: 600,
	closeAction: 'close',
	bodyStyle: 'padding: 5px;',
	modal: true,
	showPreview: true,
	layout: 'border',
	initComponent: function() {
		var me = this, graph = getActiveGraph().getGraph(), cell = graph.getSelectionCell();
		
		var form = new Ext.form.FormPanel({
			bodyStyle: 'padding: 10px',
			border: false,
			region: 'north',
			height: 50,
			defaultType: 'textfield',
			labelWidth: 200,
			labelAlign: 'right',
			items: [{
				fieldLabel: '步骤名称',
				anchor: '-40',
				name: 'label',
				value: cell.getAttribute('label')
			}]
		});
		
        //给下拉框赋值	
		var store = new Ext.data.JsonStore({
			fields: ['name', 'type', 'length', 'precision', 'origin', 'storageType', 'conversionMask', 'currencySymbol', 'decimalSymbol', 'groupingSymbol', 'trimType', 'comments'],
			proxy: new Ext.data.HttpProxy({
				url: GetUrl('trans/inputOutputFields.do'),
				method: 'POST'
			})
		});
		
		var enc = new mxCodec(mxUtils.createXmlDocument());
		var node = enc.encode(graph.getModel());
		
		store.baseParams.stepName = encodeURIComponent(cell.getAttribute('label'));
		store.baseParams.graphXml = mxUtils.getPrettyXml(node);
		store.baseParams.before = true;
		store.load();
		
		var fieldset = new Ext.form.FormPanel({
			bodyStyle: 'padding: 5px',
			labelWidth: 200,
			labelAlign: 'right',
			region: 'north',
			height: 180,
			items: [{
				xtype: 'fieldset',
				title: '从字段获取文件名',
				items: [{
					xtype: 'checkbox',
					fieldLabel: '文件名定义在字段里?',
					checked: cell.getAttribute('IsInFields') == 'Y'
				},new Ext.form.ComboBox({
					fieldLabel: '从字段获取文件名',
					anchor: '-10',
					displayField: 'name',
					valueField: 'name',
					typeAhead: true,
			        mode: 'local',
			        forceSelection: true,
			        triggerAction: 'all',
			        selectOnFocus:true,
					store: store,
				    hiddenName: 'fieldname',
					value: cell.getAttribute('fieldname')
				}),new Ext.form.ComboBox({
					fieldLabel: '从字段获取通配符',
					anchor: '-10',
					displayField: 'name',
					valueField: 'name',
					typeAhead: true,
			        mode: 'local',
			        forceSelection: true,
			        triggerAction: 'all',
			        selectOnFocus:true,
					store: store,
				    hiddenName: 'fieldname',
					value: cell.getAttribute('fieldname')
				}),new Ext.form.ComboBox({
					fieldLabel: '通配符(排除)',
					anchor: '-10',
					displayField: 'name',
					valueField: 'name',
					typeAhead: true,
			        mode: 'local',
			        forceSelection: true,
			        triggerAction: 'all',
			        selectOnFocus:true,
					store: store,
				    hiddenName: 'fieldname',
					value: cell.getAttribute('fieldname')
				}),{
					xtype: 'checkbox',
					fieldLabel: '包含子目录',
					anchor: '-30',
					value: cell.getAttribute('valueField')
				}]
			}]
		});
		
		var ext = new Ext.form.FormPanel({
			bodyStyle: 'padding: 5px',
			labelAlign: 'right',
			region: 'north',
			labelWidth: 210,
			height: 95,
			border: false,
			items: [{
            	xtype: 'compositefield',
            	anchor: '-40',
            	fieldLabel: '文件或目录',
            	items: [{
    				xtype: 'compositefield',
    				flex: 1,
    				items: [{
    					xtype: 'textfield',
    					flex: 1
    				}, {
    					xtype: 'button', text: '增加', handler: function() {
    						var databaseDialog = new DatabaseDialog({database: cell.getAttribute('connection')});
    						databaseDialog.show();
    					}
    				}, {
    					xtype: 'button', text: '浏览', handler: function() {
    						var databaseDialog = new DatabaseDialog();
    						databaseDialog.show();
    					}
    				}]
    			}]
	        }, {
	        	xtype: 'textfield',
            	anchor: '-40',
            	fieldLabel: '正则表达式'
	        }, {
	        	xtype: 'textfield',
            	anchor: '-40',
            	fieldLabel: '正则表达式(排除)'
	        }]
		});
		
		var selectedFiles = new Ext.grid.EditorGridPanel({
			title: '选中的文件',
			region :'center',
			tbar: [{
				iconCls: 'add', handler: function() {
					var RecordType = grid.getStore().recordType;
	                var p = new RecordType({
	                    name: '',
	                    type: '',
	                    format: '',
	                    length: 100
	                });
	                grid.stopEditing();
	                grid.getStore().insert(0, p);
	                grid.startEditing(0, 0);
				}
			},{
				iconCls: 'delete'
			}],
			columns: [new Ext.grid.RowNumberer(), {
				header: '文件/路径', dataIndex: 'name', width: 300, editor: new Ext.form.TextField({
	                allowBlank: false
	            })
			}, {
				header: '通配符', dataIndex: 'filemask', width: 70, editor: new Ext.form.TextField({
	                allowBlank: false
	            })
			}, {
				header: '通配符(排除)', dataIndex: 'exclude_filemask', width: 70, editor: new Ext.form.TextField({
	                allowBlank: false
	            })
			},{
				header: '要求', dataIndex: 'file_required', width: 60, renderer: function(v)
				{
					if(v == 'N') 
						return '否'; 
					else if(v == 'Y') 
						return '是';
					return v;
				}, editor: new Ext.form.ComboBox({
					store: new Ext.data.JsonStore({
			        	fields: ['value', 'text'],
			        	data: [{value: 'Y', text: '是'},
			        	       {value: 'N', text: '否'}]
			        }),
			        displayField: 'text',
			        valueField: 'value',
			        typeAhead: true,
			        mode: 'local',
			        forceSelection: true,
			        triggerAction: 'all',
			        selectOnFocus:true
			    })
			},{
				header: '包含子目录', dataIndex: 'include_subfolders', width: 80, renderer: function(v)
				{
					if(v == 'N') 
						return '否'; 
					else if(v == 'Y') 
						return '是';
					return v;
				}, editor: new Ext.form.ComboBox({
			        store: new Ext.data.JsonStore({
			        	fields: ['value', 'text'],
			        	data: [{value: 'Y', text: '是'},
			        	       {value: 'N', text: '否'}]
			        }),
			        displayField: 'text',
			        valueField: 'value',
			        typeAhead: true,
			        mode: 'local',
			        forceSelection: true,
			        triggerAction: 'all',
			        selectOnFocus:true
			    })
			}],
			store: new Ext.data.JsonStore({
				fields: ['name', 'filemask', 'exclude_filemask', 'file_required', 'include_subfolders'],
				data: Ext.decode(cell.getAttribute('file') || Ext.encode([]))
			})
		});
		
		var file = new Ext.Panel({
			layout: 'border',
			title: '文件',
			defaults: {border: false},
			items: [fieldset, {
				region: 'center',
				layout: 'border',
				items: [ext, {
					region: 'center',
					border: false,
					bodyStyle: 'padding: 0px 50px 5px 120px',
					layout: 'fit',
					items: selectedFiles
				}]
			}]
		});
		
		var content = new Ext.form.FormPanel({
			bodyStyle: 'padding: 10px',
			labelWidth: 200,
			labelAlign: 'right',
			title: '过滤',
			items: [{
				xtype: 'fieldset',
				title: '设置',
				items: [{
					xtype: 'checkbox',
					fieldLabel: '忽略空文件',
					checked: cell.getAttribute('IsIgnoreEmptyFile') == 'Y'
				},{
					xtype: 'checkbox',
					fieldLabel: '如果没有文件不进行报错',
					checked: cell.getAttribute('doNotFailIfNoFile') == 'Y'
				},{
					xtype: 'checkbox',
					fieldLabel: '忽略不完整的路径',
					checked: cell.getAttribute('ignoreMissingPath') == 'Y'
				},{
					xtype: 'textfield',
					fieldLabel: '限制',
					anchor: '-30',
					value: cell.getAttribute('limit')
				}]
			},{
				xtype: 'fieldset',
				title: '附加字段',
				items: [{
					xtype: 'checkbox',
					fieldLabel: '在输出中包含文件名',
					checked: cell.getAttribute('include') == 'Y'
				},{
					xtype: 'textfield',
					fieldLabel: '包含文件名的字段名',
					anchor: '-30',
					value: cell.getAttribute('include_field')
				},{
					xtype: 'checkbox',
					fieldLabel: '在输出中包含行数',
					checked: cell.getAttribute('rownum') == 'Y'
				},{
					xtype: 'textfield',
					fieldLabel: '包含行数的字段名',
					anchor: '-30',
					value: cell.getAttribute('rownum_field')
				}]
			},{
				xtype: 'fieldset',
				title: '增加到结果文件名',
				items: [{
					xtype: 'checkbox',
					fieldLabel: '添加文件名',
					checked: cell.getAttribute('addresultfile') == 'Y'
				}]
			}]
		});
				
		
		var tab = new Ext.TabPanel({
			region: 'center',
			activeTab: 0,
			items: [file, content]
		});
		
		this.items = [form, tab];
		
		var bCancel = new Ext.Button({
			text: '取消', handler: function() {
				me.close();
			}
		});
		var bOk = new Ext.Button({
			text: '确定', handler: function() {
				graph.getModel().beginUpdate();
                try
                {
                	var formValues = form.getForm().getValues();
                	formValues.compatibilityMode = formValues.compatibilityMode ? true : false;
                	for(var fieldName in formValues) {
						var edit = new mxCellAttributeChange(cell, fieldName, formValues[fieldName]);
                    	graph.getModel().execute(edit);
					}
                }
                finally
                {
                    graph.getModel().endUpdate();
                }
                
				me.close();
			}
		});
		
		this.bbar = ['->',bCancel,bOk];
		
		GetFileNamesDialog.superclass.initComponent.call(this);
	}
});

Ext.reg('GetFileNames', GetFileNamesDialog);
