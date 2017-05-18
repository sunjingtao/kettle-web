package org.flhy.ext.trans.steps;

import java.util.List;

import org.flhy.ext.core.PropsUI;
import org.flhy.ext.trans.step.AbstractStep;
import org.flhy.ext.utils.JSONArray;
import org.flhy.ext.utils.JSONObject;
import org.flhy.ext.utils.StringEscapeHelper;
import org.pentaho.di.core.database.DatabaseMeta;
import org.pentaho.di.trans.step.StepMetaInterface;
import org.pentaho.di.trans.steps.checksum.CheckSumMeta;
import org.pentaho.di.trans.steps.getfilenames.GetFileNamesMeta;
import org.pentaho.metastore.api.IMetaStore;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import com.mxgraph.model.mxCell;
import com.mxgraph.util.mxUtils;

@Component("GetFileNames")
@Scope("prototype")
public class GetFileNames extends AbstractStep{
	@Override
	public void decode(StepMetaInterface stepMetaInterface, mxCell cell, List<DatabaseMeta> databases, IMetaStore metaStore) throws Exception {
		GetFileNamesMeta getFileNamesMeta = (GetFileNamesMeta) stepMetaInterface;
	}

	@Override
	public Element encode(StepMetaInterface stepMetaInterface) throws Exception {
		GetFileNamesMeta getFileNamesMeta = (GetFileNamesMeta) stepMetaInterface;
		Document doc = mxUtils.createDocument();
		Element e = doc.createElement(PropsUI.TRANS_STEP_NAME);
		
/*		e.setAttribute("checkSumType", String.valueOf(checkSumMeta.getTypeByDesc()));
		e.setAttribute("resultType", String.valueOf(checkSumMeta.getResultType()));
		e.setAttribute("resultfieldName", checkSumMeta.getResultFieldName());
		e.setAttribute("compatibilityMode", String.valueOf(checkSumMeta.isCompatibilityMode()));*/
		
		JSONArray jsonArray = new JSONArray();
		String[] fileName = getFileNamesMeta.getFileName();
		for(int j=0; j<fileName.length; j++) {
			JSONObject jsonObject = new JSONObject();
			jsonObject.put("name", fileName[j]);
			jsonArray.add(jsonObject);
		}
		
		e.setAttribute("fields", jsonArray.toString());
		
		return e;
	}
}
