import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlightUser',
  standalone: true,
})
export class HighlightUserPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(commentText: string, tagDetails: any[]): SafeHtml {
    let transformedText = commentText;
    tagDetails.forEach((tag) => {
      transformedText = transformedText.replace(
        new RegExp('@' + tag.gamerTag, 'g'),
        `<span style="color: #8630F4;cursor: pointer;">@${tag.gamerTag}</span>`
      );
    });
    return this.sanitizer.bypassSecurityTrustHtml(transformedText);
  }
}
