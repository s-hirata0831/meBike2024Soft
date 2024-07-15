import { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import db from '../firebase';


interface Post {
  id: string;
  [key: string]: any;
}

const useFetchPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postData = collection(db, "posts");
        const snapShot = await getDocs(postData);
        const postDataArray = snapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postDataArray);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();

  }, []);

  return posts;
};

export default useFetchPosts;
