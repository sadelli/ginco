/**
 * Copyright or © or Copr. Ministère Français chargé de la Culture
 * et de la Communication (2013)
 * <p/>
 * contact.gincoculture_at_gouv.fr
 * <p/>
 * This software is a computer program whose purpose is to provide a thesaurus
 * management solution.
 * <p/>
 * This software is governed by the CeCILL license under French law and
 * abiding by the rules of distribution of free software. You can use,
 * modify and/ or redistribute the software under the terms of the CeCILL
 * license as circulated by CEA, CNRS and INRIA at the following URL
 * "http://www.cecill.info".
 * <p/>
 * As a counterpart to the access to the source code and rights to copy,
 * modify and redistribute granted by the license, users are provided only
 * with a limited warranty and the software's author, the holder of the
 * economic rights, and the successive licensors have only limited liability.
 * <p/>
 * In this respect, the user's attention is drawn to the risks associated
 * with loading, using, modifying and/or developing or reproducing the
 * software by the user in light of its specific status of free software,
 * that may mean that it is complicated to manipulate, and that also
 * therefore means that it is reserved for developers and experienced
 * professionals having in-depth computer knowledge. Users are therefore
 * encouraged to load and test the software's suitability as regards their
 * requirements in conditions enabling the security of their systemsand/or
 * data to be ensured and, more generally, to use and operate it in the
 * same conditions as regards security.
 * <p/>
 * The fact that you are presently reading this means that you have had
 * knowledge of the CeCILL license and that you accept its terms.
 */

Ext.define('GincoApp.controller.MainTreeController', {
	extend : 'Ext.app.Controller',

	views : [ 'LeftPanel' ],
	stores : [ 'MainTreeStore' ],
    models : [ 'ThesaurusModel' ],
	xProblemLabel : 'Problem',
	xProblemLoadMsg : 'Unable to load thesaurus tree',

	onNodeDblClick : function(tree, aRecord, item, index, e, eOpts) {
		if (aRecord.data.type == "THESAURUS") {
			this.openThesaurusTab(aRecord);
		}
		if (aRecord.data.type == "CONCEPT") {
			this.openConceptTab(aRecord);
		}	
		if (aRecord.data.type == "ARRAYS") {
			this.openTabArray(aRecord);
		}
		if (aRecord.data.type == "GROUPS") {
			this.openTabGroup(aRecord);
		}
		if (aRecord.data.type == "FOLDER"
				&& aRecord.data.id.indexOf("SANDBOX") === 0) {
			this.openSandBoxTab(aRecord.parentNode);
		}
		return false;
	},
	openConceptTab: function (aRecord) {
		var topTabs = Ext.ComponentQuery.query('topTabs')[0];
		var conceptId = aRecord.data.id.substring(aRecord.data.id.indexOf('*')+1);
		topTabs.fireEvent('openconcepttab',topTabs, aRecord.data.thesaurusId, conceptId);
	},
	openTabArray: function (aRecord) {
		var topTabs = Ext.ComponentQuery.query('topTabs')[0];
		topTabs.fireEvent('openarraytab',topTabs, aRecord.data.thesaurusId, aRecord.data.id);
	},
	openTabGroup: function (aRecord) {
		var topTabs = Ext.ComponentQuery.query('topTabs')[0];
		topTabs.fireEvent('opengrouptab',topTabs, aRecord.data.thesaurusId, aRecord.data.id);
	},

    openSandBoxTab : function(aRecord) {
    	var topTabs = Ext.ComponentQuery.query('topTabs')[0];
		topTabs.fireEvent('opensandboxtab',topTabs,aRecord.data.id);
	},
	openThesaurusTab : function(aRecord) {
		var topTabs = Ext.ComponentQuery.query('topTabs')[0];
		topTabs.fireEvent('openthesaurustab',topTabs,aRecord.data.id);
	},
	onEnterKey : function(theTree) {
		var node = theTree.getSelectionModel().getSelection();
		if (node.length > 0) {
			this.onNodeDblClick(theTree, node[0]);
		}

	},
	onTreeRender : function(theTree) {
		this.loadTreeView(theTree);
	},
	loadTreeView : function(theTree) {
		var treeState,me = this;
		if (theTree)
		{
			treeState = theTree.getState();
		}
		var MainTreeStore = this.getMainTreeStoreStore();
		if (MainTreeStore.isLoading()==false) {
			MainTreeStore.load({
				callback: function (theStore, aOperation){
					if (aOperation.success==false)
					{
						Thesaurus.ext.utils.msg(me.xProblemLabel,
								me.xProblemLoadMsg+ " : "+ aOperation.error.statusText);
					} else{
						this.getRootNode().expand();
						if (treeState)
						{
							theTree.applyState(treeState);
						}
					}
					
					theTree.getView().focus();
					theTree.getView().getEl().set({tabindex:0});
					try {
						theTree.getSelectionModel().select(0);
					} catch(e) {} 
			    }
			});
		}
		
	},
	onRefreshBtnClick : function(theButton) {
		var theTreeView = theButton.up("treepanel");
		this.loadTreeView(theTreeView);
	},
	onTreeLoad : function(theTree)
	{
		var theTree = Ext.ComponentQuery.query('#mainTreeView')[0];
		var me = this;
		this.nav = new Ext.util.KeyNav({
			target : theTree.getEl(),

			"enter" : function() {
				me.onEnterKey(theTree);
			},
			scope : me
		});
	},
	onRefreshTreeEvent : function()
	{
		var theTree = Ext.ComponentQuery.query('#mainTreeView')[0];
		Ext.log({},'onRefreshTreeEvent');
		this.loadTreeView(theTree);
	},
	onItemSelect : function(theTree, theRecord)
	{
		theTree = Ext.ComponentQuery.query('#mainTreeView')[0];
		var selectBtn = theTree.down("#selectBtn");
		selectBtn.setDisabled(!theRecord.get("displayable"));
	}, 
	onSelectBtnClick : function()
	{
		var theTree = Ext.ComponentQuery.query('#mainTreeView')[0];
		var node = theTree.getSelectionModel().getSelection();
		if (node.length > 0) {
			this.onNodeDblClick(theTree, node[0]);
		}
	},
	init : function(application) {
		// Handling application treeview refresh requests
		 this.application.on({
			 	thesaurusupdated: this.onRefreshTreeEvent,
			 	conceptupdated: this.onRefreshTreeEvent,
			 	conceptdeleted: this.onRefreshTreeEvent,
                thesaurusdeleted: this.onRefreshTreeEvent,
                conceptgroupupdated: this.onRefreshTreeEvent,
                conceptgroupdeleted: this.onRefreshTreeEvent,
                conceptarrayupdated: this.onRefreshTreeEvent,
                conceptarraydeleted: this.onRefreshTreeEvent,
		        scope: this
		 });
		this.control({
			"#mainTreeView" : {
				beforeitemdblclick : this.onNodeDblClick,
				render : this.onTreeRender,
				load : this.onTreeLoad,
				select : this.onItemSelect
			},
			"#mainTreeView #selectBtn" : {
				click : this.onSelectBtnClick
			},
			'#mainTreeView tool[type="refresh"]' : {
				click : this.onRefreshBtnClick
			}
		});
	}

});
