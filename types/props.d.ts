export type ParamsProps = {
  params: { slug: string };
};

export type SearchParamsProps = {
  searchParams: {
    q?: string;
    filter?: string;
    page?: number;
    pageSize?: number;
  };
};

export type ParamsSearchProps = ParamsProps & SearchParamsProps;

export type MetaDataProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export interface IComments {
  id: string | Key | null | undefined;
  content: string;
  commented_to_id: string;
  created_at: Date | string;
  user_name: string;
}
