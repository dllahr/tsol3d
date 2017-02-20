#!/bin/bash

input_file=$1

sed -e 's/ ALA / Ala /' -e 's/ ARG / Arg /' -e 's/ ASN / Asn /' -e 's/ ASP / Asp /' -e 's/ CYS / Cys /' -e 's/ GLN / Gln /' -e 's/ GLU / Glu /' -e 's/ GLY / Gly /' -e 's/ HIS / His /' -e 's/ ILE / Ile /' -e 's/ LEU / Leu /' -e 's/ LYS / Lys /' -e 's/ MET / Met /' -e 's/ PHE / Phe /' -e 's/ PRO / Pro /' -e 's/ SER / Ser /' -e 's/ THR / Thr /' -e 's/ TRP / Trp /' -e 's/ TYR / Tyr /' -e 's/ VAL / Val /' "$input_file"

