import React, { useState } from 'react'
import Filter from './Filter'
import SearchResult from './SearchResult';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetSearchCoursesQuery } from '@/features/api/courseApi';
import { useSearchParams } from 'react-router-dom';

const SearchPage = () => {

    const [searchParams]=useSearchParams();
    const query=searchParams.get("query");
console.log(query);


const[selectedCategories,setSelectedCategories]=useState([]);
const[sortByPrice,setSortByPrice]=useState("");



   const {data,isLoading}=useGetSearchCoursesQuery({

    searchQuery:query,
    categories:selectedCategories,
    sortByPrice
   });

    const isEmpty=!isLoading && data?.courses.length===0;

const handleFilterChange=(categories,price)=>{
setSelectedCategories(categories);
setSortByPrice(price);
}

  return (
    <div className='max-w-7xl mx-auto p-4 md:p-8 mt-5'>
        <div className='my-6'>
<h1 className='font-bold text-xl md:text-2xl'>result for "{query}"</h1>

<p>Showing result for {" "}

    <span className='text-blue-800 font-bold italic'>{query}</span>
</p>
        </div>

        <div className='flex flex-col md:flex-row gap-10'>
<Filter handleFilterChange={handleFilterChange} />
<div className='flex-1'>
{

    isLoading?(
        Array.from({length:3}).map((_,idx)=>(
            <CourseSkeleton key={idx}/>
        ))
    ):isEmpty?(<CourseNotFound/>):(
        data?.courses?.map((course)=>(
            <SearchResult key={course._id} course={course}/>
        ))
    )
}


</div>
        </div>
    </div>
  )
}

export default SearchPage


const CourseSkeleton=()=>{
  return (
 <Card className="mb-6">
      <CardContent className="p-4 space-y-4">
        <Skeleton className="h-48 w-full rounded-md" />
        <Skeleton className="h-6 w-2/3 rounded" />
        <Skeleton className="h-4 w-1/2 rounded" />
        <div className="flex gap-4 mt-2">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );

}


const CourseNotFound=()=>{
    return (
       <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-100 rounded-md shadow-md">
      <AlertCircle size={48} className="text-red-500 mb-4" />
      <h2 className="text-xl font-semibold text-gray-700 mb-2">No Courses Found</h2>
      <p className="text-gray-500">We couldn't find any courses matching your search.</p>
    </div>
    )
}