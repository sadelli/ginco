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
package fr.mcc.ginco.tests.imports;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import junit.framework.Assert;

import org.apache.cxf.helpers.IOUtils;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.Resource;

import fr.mcc.ginco.beans.Thesaurus;
import fr.mcc.ginco.dao.IAssociativeRelationshipDAO;
import fr.mcc.ginco.dao.INodeLabelDAO;
import fr.mcc.ginco.dao.INoteDAO;
import fr.mcc.ginco.dao.IThesaurusArrayDAO;
import fr.mcc.ginco.dao.IThesaurusConceptDAO;
import fr.mcc.ginco.dao.IThesaurusDAO;
import fr.mcc.ginco.dao.IThesaurusTermDAO;
import fr.mcc.ginco.exceptions.BusinessException;
import fr.mcc.ginco.imports.ConceptBuilder;
import fr.mcc.ginco.imports.ConceptNoteBuilder;
import fr.mcc.ginco.imports.NodeLabelBuilder;
import fr.mcc.ginco.imports.SKOSImportServiceImpl;
import fr.mcc.ginco.imports.TermBuilder;
import fr.mcc.ginco.imports.ThesaurusArrayBuilder;
import fr.mcc.ginco.imports.ThesaurusBuilder;
import fr.mcc.ginco.tests.LoggerTestUtil;


public class SKOSImportServiceTest {
	@Mock(name = "thesaurusDAO")
	private IThesaurusDAO thesaurusDAO;

	@Mock(name = "thesaurusConceptDAO")
	private IThesaurusConceptDAO thesaurusConceptDAO;

	@Mock(name = "thesaurusTermDAO")
	private IThesaurusTermDAO thesaurusTermDAO;

	@Mock(name = "associativeRelationshipDAO")
	private IAssociativeRelationshipDAO associativeRelationshipDAO;

	@Mock(name = "noteDAO")
	private INoteDAO noteDAO;

	@Mock(name = "thesaurusArrayDAO")
	private IThesaurusArrayDAO thesaurusArrayDAO;

	@Mock(name = "nodeLabelDAO")
	private INodeLabelDAO nodeLabelDAO;

	@Mock(name = "skosThesaurusBuilder")
	private ThesaurusBuilder thesaurusBuilder;

	@Mock(name = "skosConceptBuilder")
	private ConceptBuilder conceptBuilder;

	@Mock(name = "skosConceptNoteBuilder")
	private ConceptNoteBuilder conceptNoteBuilder;

	@Mock(name = "skosTermBuilder")
	private TermBuilder termBuilder;

	@Mock(name = "skosArrayBuilder")
	private ThesaurusArrayBuilder arrayBuilder;

	@Mock(name = "skosNodeLabelBuilder")
	private NodeLabelBuilder nodeLabelBuilder;
	
	
	@InjectMocks	
    private SKOSImportServiceImpl skosImportService ;

	@Before
	public void init() {
		MockitoAnnotations.initMocks(this);
		LoggerTestUtil.initLogger(skosImportService);
	}
	
    @Test
    public void testImportSKOSFile() throws BusinessException, IOException {
    	Thesaurus returnedThesaurus = new Thesaurus();
    	returnedThesaurus.setIdentifier("http://data.culture.fr/thesaurus/resource/ark:/67717/T69");
    	Mockito.when(thesaurusDAO.getById(Mockito.anyString())).thenReturn(null);
  		Mockito.when(thesaurusBuilder.buildThesaurus(Mockito.any(Resource.class),	Mockito.any(Model.class))).thenReturn(returnedThesaurus);

    	
      String fileName = "concept_collections_temp.rdf";
      String tempDir = System.getProperty("java.io.tmpdir");
      InputStream is = ConceptBuilderTest.class
				.getResourceAsStream("/imports/concept_collections.rdf");
      String fileContent = IOUtils.toString(is);
      
      Thesaurus th = skosImportService.importSKOSFile(fileContent, fileName, new File(tempDir));
      Assert.assertEquals("http://data.culture.fr/thesaurus/resource/ark:/67717/T69", th.getIdentifier());
    }  
    
    @Test(expected=BusinessException.class)
    public void testImportSKOSFileExistingThesaurus() throws BusinessException, IOException {
    	Mockito.when(thesaurusDAO.getById(Mockito.anyString())).thenReturn(new Thesaurus());
    	
      String fileName = "concept_collections_temp.rdf";
      String tempDir = System.getProperty("java.io.tmpdir");
      InputStream is = ConceptBuilderTest.class
				.getResourceAsStream("/imports/concept_collections.rdf");
      String fileContent = IOUtils.toString(is);
      skosImportService.importSKOSFile(fileContent, fileName, new File(tempDir));
    }
    
    
}