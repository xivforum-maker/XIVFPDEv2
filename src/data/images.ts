import { ASSETS } from "@/src/assets/images";

export const images = {
  hero: {
    url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
    alt: "Abstract mathematical background",
    overlay: "bg-primary-900/80 mix-blend-multiply",
    gradient: "bg-gradient-to-b from-primary-900/50 via-transparent to-primary-900/90"
  },
  globalBackground: {
    url: "https://lh3.googleusercontent.com/d/1Ryr8EP7S9YS6N1jzYwltiNyP-t9kg7eH",
    size: "cover",
    position: "center",
    attachment: "fixed"
  },
  bedlewo: {
    // url: "https://scontent-fra5-1.xx.fbcdn.net/v/t39.30808-6/502464674_1129662912302205_1360854566771377972_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=2a1932&_nc_ohc=2VSXw59k1AQQ7kNvwGXWBcj&_nc_oc=AdrTxIMvYwP32SzxmHWf9TKnojtKyomFREJkU3Esb8oFrQ_N6qt7ilVzCu-h3_RTw34&_nc_zt=23&_nc_ht=scontent-fra5-1.xx&_nc_gid=T8pZ-h-LXJxRRFpXYn8RAw&_nc_ss=7a32e&oh=00_AfzSNrp4PGsOeVmb8onA3tUMZSRgj0bB1sR_euTppwUKHA&oe=69C844B6",
    url:  ASSETS.bedlewo,
    alt: "Będlewo Palace",
    objectPosition: "70% 90%",
    transform: "scale(1.0)",
    maskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%), linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)"
  }
};
