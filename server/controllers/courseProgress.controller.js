import { CourseProgress } from "../models/courseProgress.js";
import { Course } from "../models/course.model.js";

export const getCourseProgress = async (req,res) => {


    try {
        
const {courseId}=req.params;
const userId=req.id;

//step-1 fetch user course progress


let courseProgress=await CourseProgress.findOne({userId,courseId}).populate("courseId");

const courseDetails=await Course.findById(courseId).populate("lectures");


if(!courseDetails){
return res.status(404).json({
    message: "Course not found"
});
}




// //steo-2 if not progress found return course detail with empty progress


if(!courseProgress){
    return res.status(200).json({
        data:{
            courseDetails,
            progress:[],
completed:false

        }
    })
}


//step3 return thhe user course prgress along with course details
return res.status(200).json({
    data: {
        courseDetails,
        progress: courseProgress.lectureProgress,
        completed: courseProgress.completed
    }
})









    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get course progress"
        });
        
    }

}




export const updateLectureProgress=async(req,res)=>{
try {
    

const {courseId,lectureId}=req.params;
const userId=req.id;

//fecth or create course progress

let courseProgress=await CourseProgress.findOne({userId,courseId});

if(!courseProgress){
   courseProgress = new CourseProgress({
    userId,
    courseId,
    completed: false,
    lectureProgress: []
});
await courseProgress.save();

}



// find the lecture progress in the course progress
const lectureIndex= courseProgress.lectureProgress.findIndex((lecture)=> lecture.lectureId===lectureId);

if(lectureIndex!==-1){

courseProgress.lectureProgress[lectureIndex].viewed=true;

}
else{
courseProgress.lectureProgress.push({
    lectureId,
    viewed: true
});
}

// check if all lectures are viewed
const lectureProgressLength=courseProgress.lectureProgress.filter((lectureProg) => lectureProg.viewed).length;


const course=await Course.findById(courseId);

if(course.lectures.length === lectureProgressLength){
    courseProgress.completed = true;
}

await courseProgress.save();


return res.status(200).json({
    message: "Lecture progress updated successfully",
   
});



} catch (error) {
    console.log(error);
    return res.status(500).json({
        message: "Failed to update lecture progress"
    });
    
}

}




export const markAsCompleted = async (req, res) => {

try {
    
const { courseId } = req.params;
const userId = req.id;

const courseProgress = await CourseProgress.findOne({ userId, courseId });

if(!courseProgress) {
    return res.status(404).json({
        message: "Course progress not found"
    });
}

courseProgress.lectureProgress.map((lectureProgress)=>lectureProgress.viewed=true);

courseProgress.completed = true;
await courseProgress.save();

return res.status(200).json({
    message: "Course marked as completed successfully",
   
});

} catch (error) {
    console.log(error);
    return res.status(500).json({
        message: "Failed to mark course as completed"
    });
    
}

}

export const markAsInCompleted = async (req, res) => {

try {
    
const { courseId } = req.params;
const userId = req.id;

const courseProgress = await CourseProgress.findOne({ userId, courseId });

if(!courseProgress) {
    return res.status(404).json({
        message: "Course progress not found"
    });
}

courseProgress.lectureProgress.map((lectureProgress)=>lectureProgress.viewed=false);

courseProgress.completed = false;
await courseProgress.save();

return res.status(200).json({
    message: "Course marked as incompleted successfully",
   
});

} catch (error) {
    console.log(error);
    return res.status(500).json({
        message: "Failed to mark course as completed"
    });
    
}

}


