<script setup>
import { qryArticlesLatest } from "~/queries/articles";
import { qryLatestProducts } from "~/queries/printify";
const { data: articles } = await useSanityQuery(qryArticlesLatest);
const { data: products } = await useSanityQuery(qryLatestProducts);
</script>
<template></template>
