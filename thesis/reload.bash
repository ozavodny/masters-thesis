cd /thesis

#!/bin/bash
FILE="text/text.tex"
LAST=`ls -l "$FILE"`
latexmk -c ctufit-thesis.tex 
latexmk -pdfxe ctufit-thesis.tex
while true; do
  sleep 2
  NEW=`ls -l "$FILE"`
  if [ "$NEW" != "$LAST" ]; then
    latexmk -c ctufit-thesis.tex 
    latexmk -pdfxe ctufit-thesis.tex
    LAST="$NEW"
  else
    echo "no change"
  fi
done