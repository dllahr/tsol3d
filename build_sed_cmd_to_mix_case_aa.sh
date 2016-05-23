#!/bin/bash

cmd="";

while read line; 
do 
	aa=($line); 
	echo ${aa[0]}   ${aa[1]}; 
	cmd=$cmd" -e 's/ ${aa[0]} / ${aa[1]} /'"; 
done < pdb_amino_acids.txt

echo $cmd

