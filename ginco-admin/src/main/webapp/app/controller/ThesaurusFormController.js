Ext.define('GincoApp.controller.ThesaurusFormController', {
	extend : 'Ext.app.Controller',

	views : [ 'ThesaurusPanel' ],

	models : [ 'ThesaurusModel' ],
	stores : [ 'MainTreeStore' ],

	loadPanel : function(theForm) {
		var me = this;
		var model = this.getThesaurusModelModel();
		var id = theForm.up('thesaurusPanel').thesaurusId;
		if (id != '') {
			theForm.getEl().mask("Chargement");
			model.load(id, {
				success : function(model) {
					me.loadData(theForm, model);
					theForm.getEl().unmask();
				}
			});
		} else {
			model = Ext.create('GincoApp.model.ThesaurusModel');
			model.id = -1;
			theForm.loadRecord(model);
		}
	},
	updateTreeView : function() {
		var MainTreeStore = this.getMainTreeStoreStore();
		MainTreeStore.load();
	},
	loadData : function(aForm, aModel) {
		var thesaurusPanel = aForm.up('thesaurusPanel');
		thesaurusPanel.setTitle(aModel.data.title);
		aForm.setTitle(aModel.data.title);
		aForm.loadRecord(aModel);
		thesaurusPanel.down('button[cls=newBtnMenu]').setDisabled(false);
		
	},
	onNewTermBtnClick : function(theButton, e, options) {
		var thePanel = theButton.up('thesaurusPanel');
		var termPanel = this.createPanel('GincoApp.view.TermPanel');
		termPanel.thesaurusId =  thePanel.thesaurusId;
	},
	createPanel : function(aType)
	{
		var aNewPanel = Ext.create(aType);
		var topTabs = Ext.ComponentQuery.query('topTabs')[0];
		var tab = topTabs.add(aNewPanel);
		topTabs.setActiveTab(tab);
		tab.show();
		return aNewPanel;
	},

	saveForm : function(theButton) {
		var me = this;
		var theForm = theButton.up('form');
		if (theForm.getForm().isValid()) {
			theForm.getEl().mask("Chargement");
			theForm.getForm().updateRecord();
			var updatedModel = theForm.getForm().getRecord();
			updatedModel.save({
				success : function(record, operation) {
					me.loadData(theForm, record);
					theForm.getEl().unmask();
					Thesaurus.ext.utils.msg('Succès',
							'Le thesaurus a été enregistré!');
					me.updateTreeView();
				},
				failure : function() {
					theForm.getEl().unmask();
					Thesaurus.ext.utils.msg('Problème',
							"Impossible d'enregistrer le thesaurus!");
				}
			});
		}
	},
	init : function(application) {
		this.control({
			'thesaurusPanel form' : {
				afterrender : this.loadPanel
			},
			'thesaurusPanel button[cls=save]' : {
				click : this.saveForm
			},
			"thesaurusPanel #newTermBtn" : {
				click : this.onNewTermBtnClick
			}

		});
	}
});
