import {Request} from "express";
import {SortDirection} from "mongodb";

export type SortType = {
    searchNameTerm: string | null
    sortBy:string
    sortDirection: SortDirection
    pageNumber: number
    pageSize: number
    searchLoginTerm: string | null
    searchEmailTerm: string | null
}

export const paginationQueries = (req: Request):SortType => {
    let searchNameTerm: string | null = req.query.searchNameTerm ? req.query.searchNameTerm.toString() : null;
    let sortBy:string = req.query.sortBy ? req.query.sortBy.toString() : "createdAt";
    let sortDirection: 'asc'|'desc' =
        req.query.sortDirection && req.query.sortDirection.toString() === 'asc'
            ? 'asc'
            : 'desc'
    let pageNumber: number = req.query.pageNumber ? +req.query.pageNumber : 1;
    let pageSize:number = req.query.pageSize ? +req.query.pageSize : 10;
    let searchLoginTerm: string | null = req.query.searchLoginTerm ? req.query.searchLoginTerm.toString() : null;
    let searchEmailTerm: string | null = req.query.searchEmailTerm ? req.query.searchEmailTerm.toString() : null;
    return {searchNameTerm, sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm};
}
