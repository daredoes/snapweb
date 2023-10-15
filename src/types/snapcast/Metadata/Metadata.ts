interface Metadata {
  title?: string;
  artist?: string[];
  album?: string;
  artUrl?: string;
  artData?: {
    data: string;
    extension: string;
  };
  duration?: number;
}

export default Metadata;
