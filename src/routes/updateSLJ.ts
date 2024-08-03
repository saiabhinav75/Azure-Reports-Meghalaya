import { supabaseClient as supabase } from "./index";


export async function UpdateRCASLJ(assementType:string,studentId:string,bucket:string,studentClass:number){
    const {data:existingData,error:existingError} = await supabase.from('student_learning_journey').select("current,id,status,grade").eq('student_id',studentId).eq("sub_course_id",1).single();
 
    if(existingError) {
        console.log(existingError);
        throw existingError.message;
    }
 
    let current:{month:number,week:number,index:number,completed:number};
    let status:{total:number,completed:number,progress:string};
    let grade:{bucket:string,averageGrade:string};
 
    if ( assementType === "Baseline" ) {
 
        const {data:mappingData,error:mappingError} = await supabase.from('rca_mapping').select("assessment_ids").eq("class",studentClass).eq("month",1).eq("bucket",bucket[0]);
 
        if(mappingError) {
            console.log(mappingError.message);
            throw mappingError.message;
        }
    
        let total = 0;
        for(let data of mappingData) {
            total += data.assessment_ids.length;
        }
 
        current = {month:1,week:0,index:0,completed:-1};
        status = {total,completed:0,progress:"inprogress"};
        grade = {bucket,averageGrade:bucket};
 
        const {data:updateData,error:updateError} = await supabase.from('student_learning_journey').update({current,status,grade}).eq('id',existingData.id);
 
        if(updateError) {
            console.log(updateError.message);
            throw updateError.message;
        }
 
    } else if ( assementType === "Practice" ) {
 
        const {data:mappingData,error:mappingError} = await supabase.from('rca_mapping').select("assessment_ids").eq("class",studentClass).eq("month",1).eq("bucket",bucket[0]).eq("week",existingData.current.week);
 
        if(mappingError) {
            console.log(mappingError.message);
            throw mappingError.message;
        }
 
        const total = mappingData.length;
 
        if(existingData.current.index === total -1) {
            if(existingData.current.week === 3) {
                current = {month:existingData.current.month,week:existingData.current.week+1,completed:-1,index:0};
                status = {total:existingData.status.total,completed:existingData.status.completed+1,progress:existingData.status.progress};
                grade = {bucket:existingData.grade.bucket,averageGrade:existingData.grade.bucket};
            } else {
                current = {month:existingData.current.month,week:existingData.current.week+1,index:0,completed:-1};
                status = {total:existingData.status.total,completed:existingData.status.completed+1,progress:existingData.status.progress};
                grade={bucket:existingData.grade.bucket,averageGrade:existingData.grade.bucket};
            }
        } else{
            current = {month:existingData.current.month,week:existingData.current.week,index:existingData.current.index+1,completed:-1};
            status = {total:existingData.status.total,completed:existingData.status.completed+1,progress:existingData.status.progress};
            grade={bucket:existingData.grade.bucket,averageGrade:existingData.grade.bucket};
        }
 
        const {data:updateData,error:updateError} = await supabase.from('student_learning_journey').update({current,status,grade}).eq('id',existingData.id);
 
        if(updateError) {
            console.log(updateError.message);
            throw updateError.message;
        }
 
    } else if (assementType === "MonthEnd") {
 
    } else if (assementType === "TermEnd") {
 
    }
}